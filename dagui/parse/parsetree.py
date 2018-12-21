class ParseTree:

    def __init__(self, source_string, start_index, end_index,
            branches, inner_sectioning_character_locations):
        """
        String -> Int -> Int -> [SectioningCharacter]
            -> [ParseTree or String] -> ParseTree
        """
        self.source_string = source_string
        self.start_index = start_index
        self.end_index = end_index
        self.branches = branches
        self.inner_sectioning_character_locations = \
            inner_sectioning_character_locations
        
    def inner_string(self):
        """
        () -> String
        """
        return self.source_string[self.start_index:self.end_index]
