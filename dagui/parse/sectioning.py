class SectioningCharacter:
    DEFAULTS = [
        ('(', ')'),
        ('[', ']'),
        ('{', '}'),
        ('"', '"')
    ]

    def __init__(self, pair_id, char, opening,
            line=None, column=None, index=None, enclosing_level=None):
        """
        Int -> Char -> Bool -> Int? -> Int? -> Int? -> Int?
            -> SectioningCharacter
        Contains data about an instance of a sectioning character
        within a string.  If opening is None, this denotes that
        whether or not the character is opening or closing
        depends on the context.  The pair ID is a unique integer
        identifying each pair of sectioning characters.
        """
        self.char = char
        self.pair_id = pair_id

        self.opening = None
        self.closing = None
        self.set_opening(opening)

        self.line = line
        self.column = column
        self.index = index

        self.enclosing_level = enclosing_level

    def set_opening(self, opening):
        """
        Bool -> ()
        """
        if opening is None:
            self.opening = None
            self.closing = None
        else:
            self.opening = opening
            self.closing = not opening

    def at(self, line, column, index):
        """
        Int -> Int -> Int -> SectioningCharacter
        Return a new instance which is the same as this instance
        but with a different index.
        """
        return SectioningCharacter(self.pair_id, self.char,
            self.opening, line=line, column=column, index=index,
            enclosing_level=self.enclosing_level)

    def compliments(self, other):
        """
        SectioningCharacter -> Bool
        Return True iff this sectioning character can close a section
        that was opened by the other.
        """
        return (other.opening and self.closing) \
            and (self.pair_id == other.pair_id)

    @classmethod
    def lookups(cls, character_pairs=None):
        """
        [(Char, Char)] -> Dict Char SectioninCharacter
        Given a list of sectioning character pairs, create a
        lookup dictionary.
        """
        if character_pairs is None:
            character_pairs = cls.DEFAULTS

        d = {}
        i = 0
        for opener, closer in character_pairs:
            if opener == closer:
                d[opener] = SectioningCharacter(i, opener, None)
            else:
                d[opener] = SectioningCharacter(i, opener, True)
                d[closer] = SectioningCharacter(i, closer, False)
            i += 1
        return d
    
    def __str__(self):
        """
        () -> String
        """
        return 'pair {} character {} at l {}, c {}, {} encloses level {}'.format(
            self.pair_id,
            self.char,
            self.line,
            self.column,
            'opening' if self.opening == True \
                else 'closing' if self.closing == True \
                else 'context unknown',
            self.enclosing_level
        )


def section_character_locations(lookup,
        escape_character, newline_character, string):
    """
    Dict Char SectioningCharacter -> Char -> Char -> String -> [Int]
    Compile an ordered list of all sectioning characters in the
    string.  If the escape character is not None, sectioning
    characters which come immediately after an instance of the
    escape character will be ignored.
    """
    outputs = []
    escaped = False

    line = 1
    column = 1
    index = 0

    for char in string:
        if char == escape_character and escape_character is not None:
            escaped = not escaped  # Assumes it escapes itself
        elif char == newline_character:
            if not escaped:
                line += 1
                column = 0
            else:
                escaped = False
        elif char in lookup:
            if not escaped:
                outputs.append(lookup[char].at(line, column, index))
            else:
                escaped = False
        column += 1
        index += 1
    return outputs


def determine_contexts(character_locations):
    """
    [SectioningCharacter] -> ()
    Go through a list of sectioning characters and, for each one
    whose context is unknown, work out whether it is opening or
    closing.
    """
    counts = {}
    level = 0

    for char in character_locations:
        if char.pair_id in counts:
            counts[char.pair_id] += 1
        else:
            counts[char.pair_id] = 0
        if char.opening == char.closing:
            char.set_opening(counts[char.pair_id] % 2 == 0)

        if char.opening:
            level += 1
            char.enclosing_level = level
        elif char.closing:
            char.enclosing_level = level
            level -= 1
        else:
            raise Exception('character\'s context is not set')


def ignore_nested_sectioning_characters(lookup, character_locations):
    """
    Dict Char SectioningCharacter
        -> [SectioningCharacter] -> [SectioningCharacter]
    Remove references to sectioning characters which occur while
    nested within an undirected pair of sectioning characters.
    Undirected characters are those for which the opening or closing
    is defined by its context rather than by its 
    """
    ignore_lookup = {
        k: v.opening == v.closing for k, v in lookup.items()
    }
    ignore = False
    outputs = []
    for char in character_locations:
        if ignore_lookup[char.char]:
            ignore = char.opening
            outputs.append(char)
        elif not ignore:
            outputs.append(char)
    return outputs


def validate_sectioning_characters(character_locations):
    """
    [SectioningCharacter] -> [String]
    For the given list of sectioning character instances, resolve
    any instances for which it is unknown whether the character
    is opening or closing, and return a list of errors.
    """
    errors = []
    stack = []
    for char in character_locations:
        previous = None if len(stack) == 0 else stack[-1]
        if char.opening:
            stack.append(char)
        elif char.closing:
            if char.compliments(previous):
                stack = stack[:-1]
            else:
                errors.append('unexpected {} at line {}, column {}'
                    .format(char.char, char.line, char.column))
    
    for unclosed in stack:
        errors.append('the {} at line {}, column {} is never closed'
            .format(unclosed.char, unclosed.line, unclosed.column))

    return errors


def process_sectioning_character_locations(string,
        lookup=SectioningCharacter.lookups(),
        escape='\\', newline='\n'):
    """
    String -> Dict Char SectioningCharacter -> Char? -> Char?
        -> ([SectioningCharacter], [String])
    Extract the locations of the sectioning characters in the string,
    ignore any that are nested within strings or similar constructs,
    and return the locations along with any syntax errors.
    """
    locations = section_character_locations(
        lookup, escape, newline, string)
    determine_contexts(locations)
    locations = ignore_nested_sectioning_characters(
        lookup, locations)
    errors = validate_sectioning_characters(locations)
    return locations, errors
