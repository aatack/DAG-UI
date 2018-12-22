class Paragraph:
    def __init__(self, lines):
        """
        [Line] -> Paragraph
        Define a paragraph, which stores a list of lines.
        """
        self.lines = lines
        self.length = len(lines)

    def prune_empty_children(self):
        """
        () -> ()
        Remove all empty children from the data class.
        """
        self.lines = [line for line in self.lines \
            if line.length > 0]


class Line:
    def __init__(self, words):
        """
        [Word] -> Line
        Define a line, which stores a list of words.
        """
        self.words = words
        self.length = len(words)

    def prune_empty_children(self):
        """
        () -> ()
        Remove all empty children from the data class.
        """
        self.words = [word for word in self.words \
            if word.length > 0]


class Word:
    WORD = 0
    PARAGRAPH = 1

    def __init__(self, word=None, paragraph=None):
        """
        String? -> Paragraph? -> Word
        Create a word from either plain text or a paragraph.
        Only one of the two should be defined.
        """
        if (word is None) == (paragraph is None):
            raise Exception('exactly one argument must be defined')
        
        self.word = word
        self.paragraph = paragraph

        self.type = Word.PARAGRAPH if word is None else Word.WORD
        self.length = paragraph.length if word is None else len(word)

    def prune_empty_children(self):
        """
        () -> ()
        Remove all empty children from the data class.
        """
        if self.type == Word.PARAGRAPH:
            self.paragraph.prune_empty_children()


def read_word(data):
    """
    String or ParseTree -> Word
    Interpret the given string or parse tree as a word.  If
    a string is given, a word representing that string will
    be returned.  If a parse tree is returned, a paragraph
    representing that parse tree will be wrapped in a Word
    object and returned.
    """
    if type(data) == type(''):
        return Word(word=data)
    else:
        return Word(paragraph=read_paragraph(data))


def read_paragraph(parse_tree):
    """
    ParseTree -> Paragraph
    Attempt to read the given parse tree as a paragraph.
    """
    children = parse_tree.branches_and_leaves()
    lines = []
    for child in children:
        if type(child) == type(''):
            for line in child.split('\n'):
                if len(line) > 0:
                    lines.append([line])
        else:
            if len(lines) == 0:
                lines.append([child])
            else:
                lines[-1].append(child)
    
    return Paragraph([read_line(line) for line in lines])


def read_line(words):
    """
    [String or ParseTree] -> Line
    Attempt to read the given parse tree as a line of words.
    """
    split_words = []
    for word in words:
        if type(word) == type(''):
            split_words += word.split(' ')
        else:
            split_words.append(word)
    
    wrapped_words = [read_word(word) for word in split_words]
    return Line(wrapped_words)
