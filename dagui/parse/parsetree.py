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


def build_parse_tree(source_string, start_index, end_index,
        inner_sectioning_character_locations):
    """
    String -> Int -> Int -> [SectioningCharacter]
        -> ParseTree
    Recursively construct a parse tree from the given source
    string and the indices of its sectioning characters.
    """
    next_levels = _get_next_level_sections(
        inner_sectioning_character_locations)
    next_start_indices = map(lambda ls: ls[0].index + 1, next_levels)
    next_end_indices = map(lambda ls: ls[-1].index, next_levels)
    
    branches = []
    for si, ei, sc in zip(
        next_start_indices, next_end_indices, next_levels):
        branches.append(build_parse_tree(
            source_string, si, ei, sc[1:-1]))

    return ParseTree(source_string, start_index, end_index,
        branches, inner_sectioning_character_locations)


def _get_next_level_sections(sectioning_characters):
    """
    [SectioningCharacter] -> [[SectioningCharacter]]
    Split a list of sectioning characters into segments, where
    each segments represents a branch on the next level.
    """
    if len(sectioning_characters) == 0:
        return []

    base_level = sectioning_characters[0].enclosing_level
    return _split_on(lambda a, b: \
        a.enclosing_level == base_level and
        b.enclosing_level == base_level and
        a.closing and b.opening, sectioning_characters)


def _split_on(f, xs):
    """
    (a -> a -> Bool) -> [a] -> [[a]]
    Split a list at locations where a predicate on two
    consecutive elements is True.
    """
    if len(xs) == 0:
        return []

    output = [[xs[0]]]
    for x in xs[1:]:
        if f(output[-1][-1], x):
            output.append([x])
        else:
            output[-1].append(x)
    return output
