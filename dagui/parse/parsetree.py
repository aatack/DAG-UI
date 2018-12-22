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

    def branches_and_leaves(self, prune_empty_leaves=True):
        """
        Bool? -> [String or ParseTree]
        Return all the branches, with the leaves interspersed
        between them.
        """
        if len(self.branches) == 0:
            output = [self.inner_string()]
        else:
            output = []
            previous_branch_end = self.start_index

            for branch in self.branches:
                leaf = self.source_string[
                    previous_branch_end:branch.start_index - 1]
                if len(leaf) > 0 or not prune_empty_leaves:
                    output.append(leaf)

                output.append(branch)
                previous_branch_end = branch.end_index + 1
            output.append(self.source_string
                [previous_branch_end:self.end_index])

        return output

    def opener(self):
        """
        () -> Char
        Return the character immediately before this branch
        of the parse tree in the source string, or None if this
        branch is flush with the end of the source string.
        """
        if self.start_index == 0:
            return None
        return self.source_string[self.start_index - 1]

    def closer(self):
        """
        Return the character immediately after this branch in
        the source string, or None if this branch is flush with
        the end of the source string.
        """
        if self.end_index == len(self.source_string):
            return None
        return self.source_string[self.end_index]


def parse_tree_for(string, sectioning_characters):
    """
    String -> [SectioningCharacter] -> ParseTree
    Recursively construct a parse tree for the given string.
    """
    return build_parse_tree(string, 0, len(string),
        sectioning_characters)


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
