class Declaration:

    def __init__(self, line):
        """
        Line -> Declaration
        """
        self.line = line
        self.arguments = line[1:]

    def argument(self, n):
        """
        Int -> Word
        Return the nth argument of the declaration.
        """
        return self.arguments[n]

    def given_arity(self):
        """
        () -> Int
        Return the number of arguments passed to
        the declaration.
        """
        return len(self.arguments)

    def errors(self):
        """
        () -> [String]
        Return the errors, if any, resulting from the
        attempted compilation of the declaration.
        """
        raise NotImplementedError()

    def javascript(self):
        """
        () -> String
        Return the javascript code that the declaration
        compiles into.  If there are errors, either None
        or a nonsense output may be returned.
        """
        raise NotImplementedError()
