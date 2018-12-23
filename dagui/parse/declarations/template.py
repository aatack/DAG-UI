from dagui.parse.declarations.declaration import Declaration
from dagui.parse.constructs import Word
from json import dumps


class Template(Declaration):
    
    def __init__(self, line):
        """
        Line -> Template
        """
        super().__init__(line)

        self._errors = []
        self._json = {}

        self._build()

    def errors(self):
        """
        () -> [String]
        """
        return self._errors

    def javascript(self):
        """
        () -> String
        """
        raise NotImplementedError()

    def _build(self):
        """
        () -> ()
        Read the file, producing a JSON object that can be
        ported over to javascript while recording any errors.
        """
        self._json = {
            'templateName': self.argument(0).word,
            'data': self._paragraph_to_json(self.argument(1))
        }

    def _paragraph_to_json(self, paragraph):
        """
        Paragraph -> Dict
        Create a JSON object from the given paragraph and
        add any errors to the error list.
        """
        output = []
        for line in paragraph.lines:
            line_json = self._line_to_json(line)
            if line_json is not None:
                output.append(line_json)
        return output

    def _line_to_json(self, line):
        """
        Line -> Dict
        Create a JSON object from the given line and add any
        errors to the error list.
        """
        if self._is_template_application(line):
            return self._as_template_application(line)
        elif self._is_region(line):
            return self._as_region(line)
        elif self._is_input_declaration(line):
            return self._as_input_declaration(line)
        else:
            self._errors.append('invalid syntax at line')
            return None

    def _is_template_application(self, line):
        """
        Line -> Bool
        Determine whether or not a line can be interpreted
        as a template application.
        """
        pass

    def _as_template_application(self, line):
        """
        Line -> Dict
        Represent the given line as a template application JSON
        object.
        """
        pass

    def _is_region(self, line):
        """
        Line -> Bool
        Determine whether or not a line can be interpreted
        as a region.
        """
        pass

    def _as_region(self, line):
        """
        Line -> Dict
        Represent the given line as a region JSON object.
        """
        pass

    def _is_input_declaration(self, line):
        """
        Line -> Bool
        Determine whether or not a line can be interpreted as
        an input declaration.
        """
        pass

    def _as_input_declaration(self, line):
        """
        Line -> Dict
        Represent the given line as an input declaration
        JSON object.
        """
        pass
