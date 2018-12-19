"""
Functions for sectioning a string into the relevant sections
for parsing a .dag file.
"""

def split_on_pivots(string, pivots_indices):
    """
    String -> [Int] -> [String]
    Split a string on the characters at the given indices,
    such that the characters at those indices are left out.
    """
    indices = [-1] + pivots_indices + [len(string) + 1]
    output = []
    for i in range(len(indices) - 1):
        start = indices[i] + 1
        end = indices[i + 1]
        print(start, end)
        output.append(string[start:end])
    return output


def find_outer_line_breaks(string):
    """
    String -> [Int]
    List the indices of all new line characters which occur
    outside any brackets.
    """
    level = 0
    output = []
    for i in range(len(string)):
        if level == 0 and string[i] == '\n':
            output.append(i)
        elif string[i] == '(':
            level += 1
        elif string[i] == ')':
            level -= 1
    return output


def split_on_outer_line_breaks(string):
    """
    String -> [String]
    Split a string every time there is a line break that is
    not nested within brackets.
    """
    return split_on_pivots(string, find_outer_line_breaks(string))
