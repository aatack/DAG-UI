class SectioningCharacter:
    DEFAULTS = [
        ('(', ')'),
        ('[', ']'),
        ('{', '}'),
        ('"', '"')
    ]

    def __init__(self, pair_id, char, opening,
            line=None, column=None):
        """
        Int -> Char -> Bool -> Int -> Int -> SectioningCharacter
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

    def set_opening_from_previous(self, previous_character):
        """
        SectioningCharacter? -> ()
        Determine whether this instance should be opening or closing,
        and update it accordingly, depending on the last character
        in the stack.  If the status of this instance is already known,
        nothing happens.
        """
        if self.opening is None:
            if previous_character is None:
                self.set_opening(True)
            elif previous_character.pair_id == self.pair_id:
                self.set_opening(not previous_character.opening)
            else:
                self.set_opening(True)

    def at(self, line, column):
        """
        Int -> SectioningCharacter
        Return a new instance which is the same as this instance
        but with a different index.
        """
        return SectioningCharacter(self.pair_id, self.char,
            self.opening, line, column)

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
        return 'pair {} character {} at l {}, c {}, {}'.format(
            self.pair_id,
            self.char,
            self.line,
            self.column,
            'opening' if self.opening == True \
                else 'closing' if self.closing == True \
                else 'context unknown'
        )


def section_character_locations(sectioning_characters,
        escape_character, newline_character, string):
    """
    [(Char, Char)] -> Char -> Char -> String -> [Int]
    Compile an ordered list of all sectioning characters in the
    string.  If the escape character is not None, sectioning
    characters which come immediately after an instance of the
    escape character will be ignored.
    """
    lookup = SectioningCharacter.lookups(sectioning_characters)
    outputs = []

    escaped = False
    line = 1
    column = 1
    for char in string:
        if char == escape_character and escape_character is not None:
            escaped = not escaped  # Assumes it escapes itself
        elif char == newline_character:
            line += 1
            column = 0
        elif char in lookup:
            outputs.append(lookup[char].at(line, column))
        column += 1
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
        char.set_opening_from_previous(previous)
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
