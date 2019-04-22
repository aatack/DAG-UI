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

dag.graphs.difference = dag.graphs.graph(["minuend", "subtrahend", "difference"], 2);
dag.graphs.difference.addResponses([
    {
        variables: ["minuend", "subtrahend"],
        response: function (args) {
            return { "difference": dag.subtract(args.minuend, args.subtrahend) };
        }
    },
    {
        variables: ["minuend", "difference"],
        response: function (args) {
            return { "subtrahend": dag.subtract(args.minuend, args.difference) };
        }
    },
    {
        variables: ["difference", "subtrahend"],
        response: function (args) {
            return { "minuend": dag.add(args.difference, args.subtrahend) };
        }
    },
]);

dag.graphs.product = dag.graphs.graph(["multiplicand", "multiplier", "product"], 2);
dag.graphs.product.addResponses([
    {
        variables: ["multiplicand", "multiplier"],
        response: function (args) {
            return { "product": dag.multiply(args.multiplicand, args.multiplier) };
        }
    },
    {
        variables: ["multiplicand", "product"],
        response: function (args) {
            return { "multiplier": dag.divide(args.product, args.multiplicand) };
        }
    },
    {
        variables: ["multiplier", "product"],
        response: function (args) {
            return { "multiplicand": dag.divide(args.product, args.multiplicand) };
        }
    },
]);

dag.graphs.ratio = dag.graphs.graph(["dividend", "divisor", "ratio"], 2);
dag.graphs.ratio.addResponses([
    {
        variables: ["dividend", "divisor"],
        response: function (args) {
            return { "ratio": dag.divide(args.dividend, args.divisor) };
        }
    },
    {
        variables: ["dividend", "ratio"],
        response: function (args) {
            return { "divisor": dag.divide(args.dividend, args.ratio) };
        }
    },
    {
        variables: ["ratio", "divisor"],
        response: function (args) {
            return { "dividend": dag.multiply(args.ratio, args.divisor) };
        }
    },
]);
