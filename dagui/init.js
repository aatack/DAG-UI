dagui = {
    int: i => new Int(i),
    float: x => new Float(x),
    boolean: b => new Boolean(b),
    string: s => new String(s),
    copy: u => new Copy(u),
    wrap: v => wrap(v),
};

dag = dagui;
