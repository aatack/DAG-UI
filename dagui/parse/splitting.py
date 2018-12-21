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
        output.append(string[start:end])
    return output


def find_outer_instances_of_character(character, string):
    """
    Char -> String -> [Int]
    Find the indices of all occurences of the given character
    in the string which are not nested within brackets or 
    a string.
    """
    level = 0
    output = []

    in_string = False
    escaped = False
    for i in range(len(string)):
        if string[i] == '(' and not in_string:
            level += 1
        elif string[i] == ')' and not in_string:
            level -= 1
        elif string[i] == '"' and not escaped:
            in_string = not in_string
        elif string[i] == '\\':
            escaped = not escaped
        elif level == 0 and string[i] == character:
            escaped = False
            output.append(i)
    return output


def split_on_outer_instances_of_character(character, string):
    """
    Char -> String -> [String]
    Split a string every time there is an instance of a specific
    character which is not nested within brackets or a string.
    """
    return split_on_pivots(string,
        find_outer_instances_of_character(character, string))


def split_on_outer_line_breaks(string):
    """
    String -> [String]
    Split a string every time there is a line break that is
    not nested within brackets or a string.
    """
    return split_on_outer_instances_of_character('\n', string)


def split_on_outer_spaces(string):
    """
    String -> [String]
    Split a string every time there is a space that is not 
    nested within brackets or a string.
    """
    return split_on_outer_instances_of_character(' ', string)
