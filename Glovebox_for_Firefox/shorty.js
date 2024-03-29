/* shorty.js - by enki - https://enkimute.github.io */
!function (t, i, e) {
    "undefined" != typeof module && module.exports ? module.exports = e() : "function" == typeof define && define.amd ? define(t, e) : i[t] = e()
}
("Shorty", this, function () {
    function t(t) {
        this.tokensize = t || 10,
        this.reset(!0)
    }
    return t.prototype.reset = function (t) {
        t === !0 && (this.nodes = [{
                    up: 0,
                    weight: 0
                }
            ], this.nyt = 0, this.nodecount = 0),
        this.data = "",
        this.curpos = 0,
        this.bitCount = 7,
        this.bitChar = 0
    },
    t.prototype.findNode = function (t) {
        for (var i = this.nodes.length - 1; i > 0; i--)
            if ("undefined" != typeof this.nodes[i].symbol && this.nodes[i].symbol == t)
                return i;
        return 0
    },
    t.prototype.addNode = function (t) {
        return this.nodecount >= 2046 ? 0 : (this.nodes[++this.nodecount] = {
                up: this.nyt,
                symbol: t,
                weight: 1
            }, this.nodes[++this.nodecount] = {
                up: this.nyt,
                weight: 0
            }, this.nodes[this.nyt].weight += 1, this.nyt = this.nodecount, this.nodes[this.nodecount - 2].up != this.nodecount - 2 && this.balanceNode(this.nodes[this.nodecount - 2].up), this.nodecount - 2)
    },
    t.prototype.swapNode = function (t, i) {
        var e = this.nodes[t].symbol,
        s = this.nodes[i].symbol,
        o = this.nodes[t].weight;
        this.nodes[t].symbol = s,
        this.nodes[i].symbol = e,
        this.nodes[t].weight = this.nodes[i].weight,
        this.nodes[i].weight = o;
        for (var h = this.nodes.length - 1; h > 0; h--)
            this.nodes[h].up == t ? this.nodes[h].up = i : this.nodes[h].up == i && (this.nodes[h].up = t)
    },
    t.prototype.balanceNode = function (t) {
        for (; ; ) {
            for (var i = t, e = this.nodes[t].weight; i > 1 && this.nodes[i - 1].weight == e; )
                i--;
            if (i != t && i != this.nodes[t].up && (this.swapNode(i, t), t = i), this.nodes[t].weight++, this.nodes[t].up == t)
                return;
            t = this.nodes[t].up
        }
    },
    t.prototype.emitNode = function (t) {
        for (var i = []; 0 != t; )
            i.unshift(t % 2), t = this.nodes[t].up;
        for (var e = 0; e < i.length; e++)
            this.emitBit(i[e])
    },
    t.prototype.emitNyt = function (t) {
        this.emitNode(this.nyt);
        var i = t.length - 1;
        this.tokensize > 8 && this.emitBit(8 & i),
        this.tokensize > 4 && this.emitBit(4 & i),
        this.tokensize > 2 && this.emitBit(2 & i),
        this.tokensize > 1 && this.emitBit(1 & i);
        for (var e = 0; e < t.length; e++)
            this.emitByte(t.charCodeAt(e));
        return this.nyt
    },
    t.prototype.readNode = function () {
        if (0 == this.nyt) {
            for (var t = (this.tokensize > 8 ? 8 * this.readBit() : 0) + (this.tokensize > 4 ? 4 * this.readBit() : 0) + (this.tokensize > 2 ? 2 * this.readBit() : 0) + (this.tokensize > 1 ? this.readBit() : 0) + 1, i = ""; t--; )
                i += this.readByte();
            return i
        }
        for (var e = 0; ; ) {
            var s = this.readBit();
            if (void 0 == this.nodes[e].symbol)
                for (var o = 0; ; o++)
                    if (this.nodes[o].up == e && o != e && o % 2 == s) {
                        e = o;
                        break
                    }
            if (void 0 != this.nodes[e].symbol || 0 == this.nodes[e].weight) {
                if (this.nodes[e].weight)
                    return this.nodes[e].symbol;
                for (var t = (this.tokensize > 8 ? 8 * this.readBit() : 0) + (this.tokensize > 4 ? 4 * this.readBit() : 0) + (this.tokensize > 2 ? 2 * this.readBit() : 0) + (this.tokensize > 1 ? this.readBit() : 0) + 1, i = ""; t--; )
                    i += this.readByte();
                return i
            }
        }
    },
    t.prototype.emitBit = function (t) {
        t && (this.bitChar += 1 << this.bitCount),
        --this.bitCount < 0 && (this.data += String.fromCharCode(this.bitChar), this.bitCount = 7, this.bitChar = 0)
    },
    t.prototype.emitByte = function (t) {
        for (var i = 7; i >= 0; i--)
            this.emitBit(t >> i & 1)
    },
    t.prototype.readBit = function () {
        if (this.curpos == 8 * this.data.length)
            throw "done";
        var t = this.data.charCodeAt(this.curpos >> 3) >> (7 - this.curpos & 7) & 1;
        return this.curpos++,
        t
    },
    t.prototype.readByte = function () {
        res = 0;
        for (var t = 0; 8 > t; t++)
            res += (128 >> t) * this.readBit();
        return String.fromCharCode(res)
    },
    t.prototype.deflate = function (t) {
        var i,
        e,
        s,
        o = t.length;
        for (this.reset(), e = 0; o > e; e++) {
            if (i = t[e], this.tokensize > 1)
                if (/[a-zA-Z]/.test(i))
                    for (; o > e + 1 && i.length < this.tokensize && /[a-zA-Z]/.test(t[e + 1]); )
                        i += t[++e];
                else if (/[=\[\],\.:\"'\{\}]/.test(i))
                    for (; o > e + 1 && i.length < this.tokensize && /[=\[\],\.:\"'\{\}]/.test(t[e + 1]); )
                        e++, i += t[e];
            s = this.findNode(i),
            s ? (this.emitNode(s), this.balanceNode(s)) : (this.emitNyt(i), s = this.addNode(i))
        }
        if (7 != this.bitCount) {
            var h = this.data.length;
            this.emitNode(this.nyt),
            h == this.data.length && this.emitByte(0)
        }
        return this.data
    },
    t.prototype.inflate = function (t) {
        this.reset(),
        this.data = t;
        var i = "";
        try {
            for (var e = 0; e >= 0; e++) {
                var s = this.readNode();
                i += s;
                var o = this.findNode(s);
                o ? this.balanceNode(o) : this.addNode(s)
            }
        } catch (h) {}
        return i
    },
    t
});
