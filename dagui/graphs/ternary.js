dag.graphs.sum = dag.graphs.graph(["addend", "augend", "sum"], 2);
dag.graphs.sum.addResponses([
    {
        variables: ["addend", "augend"],
        response: function (args) {
            return { "sum": dag.add(args.addend, args.augend) };
        }
    },
    {
        variables: ["addend", "sum"],
        response: function (args) {
            return { "augend": dag.subtract(args.sum, args.addend) };
        }
    },
    {
        variables: ["augend", "sum"],
        response: function (args) {
            return { "addend": dag.subtract(args.sum, args.addend) };
        }
    },
]);
