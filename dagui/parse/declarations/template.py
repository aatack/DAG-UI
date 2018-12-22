from dagui.parse.declarations.declaration import Declaration
from dagui.parse.constructs import Word
from json import dumps


class Template(Declaration):
    
    def __init__(self, line):
        """
        Line -> Template
        """
        super().__init__(line)
        self.structure = self.argument(1) if self.given_arity() >= 2 \
            else None

    def errors(self):
        """
        () -> [String]
        """
        # TODO: implement fully
        return []

    def javascript(self):
        """
        () -> String
        """
        return self.schema() + self.template()

    def schema(self):
        """
        () -> String
        Return javascript which, when run, adds the new type's schema
        to the dagui.schema object.
        """
        f = 'dagui.schema["{}"] = mapObjectValues(s =>' + \
            ' dagui.schema[s] === undefined ? s : dagui.schema[s], {});'
        return f.format(self.line.words[1].word, dumps(self._schema_as_dict()))

    def _schema_as_dict(self):
        """
        () -> Dict
        Return the schema of the whole template as a Python
        dictionary.
        """
        # TODO: also allow this to look out for partially applied
        #       templates and add their values to the schema
        return self._find_line_schema(self.line)

    def _find_line_schema(self, line):
        """
        Line -> Dict or String
        """
        if line.words[2].type == Word.WORD and line.words[2].word[0] == '<':
            return (' '.join([w.word for w in line.words[2:]]))[1:-1]
        elif line.words[2].type == Word.PARAGRAPH:
            schema = {}
            for subline in line.words[2].paragraph.lines:
                subschema = self._find_line_schema(subline)
                if subschema is not None:
                    schema[subline.words[0].word] = subschema
            return schema if len(schema.keys()) > 0 else None
        else:
            return None

    def template(self):
        """
        () -> String
        """
        # TODO: implement fully
        return ''
