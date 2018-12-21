class Paragraph:
    def __init__(self, lines):
        """
        [Line] -> Paragraph
        Define a paragraph, which stores a list of lines.
        """
        self.lines = lines
        self.length = len(lines)


class Line:
    def __init__(self, words):
        """
        [Word] -> Line
        Define a line, which stores a list of words.
        """
        self.words = words
        self.length = len(words)


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
        self.length = len(word) or paragraph.length
