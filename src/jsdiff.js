/*
 * Javascript Diff Algorithm
 *  By John Resig (http://ejohn.org/)
 *  Modified by Chu Alan "sprite"
 *  Modularized by Ted Han
 *
 * Released under the MIT license.
 *
 * More Info:
 *  http://ejohn.org/projects/javascript-diff-algorithm/
 */
const Diff = {
  escape: function(s) {
      var n = s;
      n = n.replace(/&/g, "&amp;");
      n = n.replace(/</g, "&lt;");
      n = n.replace(/>/g, "&gt;");
      n = n.replace(/"/g, "&quot;");

      return n;
  },

  diffString: function( o, n ) {
    // trim whitespace from end of both strings.
    o = o.replace(/\s+$/, '');
    n = n.replace(/\s+$/, '');

    // run the diff using an empty array (if the input is an empty string)
    // or an array of tokens split on spaces.
    var out = this.diff(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/) );
    var str = "";

    // are there any spaces?
    // if so, push a final newline to the space list.
    var oSpace = o.match(/\s+/g);
    if (oSpace == null) { oSpace = ["\n"]; } else { oSpace.push("\n"); }
    var nSpace = n.match(/\s+/g);
    if (nSpace == null) { nSpace = ["\n"]; } else { nSpace.push("\n"); }

    if (out.n.length == 0) {
        for (var i = 0; i < out.o.length; i++) {
          str += '<del style="background-color:#fbb">' + this.escape(out.o[i]) + oSpace[i] + "</del>";
        }
    } else {
      if (out.n[0].text == null) {
        for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
          str += '<del style="background-color:#fbb">' + this.escape(out.o[n]) + oSpace[n] + "</del>";
        }
      }

      for ( var i = 0; i < out.n.length; i++ ) {
        if (out.n[i].text == null) {
          str += '<ins style="background-color:#d4fcbc">' + this.escape(out.n[i]) + nSpace[i] + "</ins>";
        } else {
          var pre = "";

          for (n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++ ) {
            pre += '<del style="background-color:#fbb">' + this.escape(out.o[n]) + oSpace[n] + "</del>";
          }
          str += " " + out.n[i].text + nSpace[i] + pre;
        }
      }
    }
    
    return str;
  },

  randomColor: function() {
      return "rgb(" + (Math.random() * 100) + "%, " + 
                      (Math.random() * 100) + "%, " + 
                      (Math.random() * 100) + "%)";
  },

  diffString2: function( o, n ) {
    o = o.replace(/\s+$/, '');
    n = n.replace(/\s+$/, '');

    var out = this.diff(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/) );

    var oSpace = o.match(/\s+/g);
    if (oSpace == null) { oSpace = ["\n"]; } else { oSpace.push("\n"); }
    var nSpace = n.match(/\s+/g);
    if (nSpace == null) { nSpace = ["\n"]; } else { nSpace.push("\n"); }

    var os = "";
    var colors = new Array();
    for (var i = 0; i < out.o.length; i++) {
        colors[i] = this.randomColor();

        if (out.o[i].text != null) {
            os += '<span style="background-color: ' +colors[i]+ '">' + 
                  this.escape(out.o[i].text) + oSpace[i] + "</span>";
        } else {
            os += "<del>" + this.escape(out.o[i]) + oSpace[i] + "</del>";
        }
    }

    var ns = "";
    for (var i = 0; i < out.n.length; i++) {
        if (out.n[i].text != null) {
            ns += '<span style="background-color: ' +colors[out.n[i].row]+ '">' + 
            this.escape(out.n[i].text) + nSpace[i] + "</span>";
        } else {
            ns += "<ins>" + this.escape(out.n[i]) + nSpace[i] + "</ins>";
        }
    }

    return { o : os , n : ns };
  },

  diff: function( o, n ) {
    var ns = new Object();
    var os = new Object();
    
    // Loop over the SECOND list of tokens and create
    // an index of positions in the SECOND list by token.
    for ( var i = 0; i < n.length; i++ ) {
      // if there's no entry for this token in `ns`
      // 
      if ( ns[ n[i] ] == null )
        ns[ n[i] ] = { rows: new Array(), o: null };
      ns[ n[i] ].rows.push( i );
    }
    
    // Loop over the FIRST list of tokens and create 
    // an index of positions in the FIRST list by token.
    for ( var i = 0; i < o.length; i++ ) {
      if ( os[ o[i] ] == null )
        os[ o[i] ] = { rows: new Array(), n: null };
      os[ o[i] ].rows.push( i );
    }

    // what is going on here.
    // Okay.  So.
    // 

    // looping over the keys in the 2nd index (which are the words/tokens)
    for ( var i in ns ) {
      // If there is a token in the 2nd index that shows up once
      // and that token shows up once in the first index
      if ( ns[i].rows.length == 1 && typeof(os[i]) != "undefined" && os[i].rows.length == 1 ) {
        // overwrite the token entry in both token lists
        // with an object representing the word and
        // its position in each text (these are basically anchors i think).
        n[ ns[i].rows[0] ] = { text: n[ ns[i].rows[0] ], row: os[i].rows[0] };
        o[ os[i].rows[0] ] = { text: o[ os[i].rows[0] ], row: ns[i].rows[0] };
      }
    }

    // This is the forward pass

    // loop over the SECOND token list (which has now been annotated with position info)
    for ( var i = 0; i < n.length - 1; i++ ) {
      // if     this token in the SECOND list ISN'T null and
      //    the next token in the SECOND list ISN'T null and
      //    this isn't out beyond the length of the FIRST token list and
      //    the next token in FIRST token list IS null and
      //    the next token in the SECOND token list IS the same to the next token in the FIRST token list.
      if ( n[i].text != null && 
           n[i+1].text == null && 
           (n[i].row + 1 < o.length) && 
           (o[ n[i].row + 1 ].text == null) && 
           (n[i+1] == o[ n[i].row + 1 ]) ) {
        // update the next token in the SECOND token list
        n[i+1] = { text: n[i+1], row: n[i].row + 1 };
        o[n[i].row+1] = { text: o[n[i].row+1], row: i + 1 };
      }
    }

    // This is the backwards pass
    
    // loop over the SECOND token list BACKWARDS
    for ( var i = n.length - 1; i > 0; i-- ) {
      // if         this token in the SECOND list ISN'T null and
      //    the previous token in the SECOND list IS null and
      //    this isn't the first token in the SECOND list and
      //    the token in the FIRST list in this position IS null and
      //    the token in the SECOND list IS the same as the token in the FIRST list
      if ( n[i].text != null && 
           n[i-1].text == null && 
           n[i].row > 0 && 
           (o[ n[i].row - 1 ].text == null) && 
           (n[i-1] == o[ n[i].row - 1 ]) ) {
        // 
        n[i-1] = { text: n[i-1], row: n[i].row - 1 };
        o[n[i].row-1] = { text: o[n[i].row-1], row: i - 1 };
      }
    }
    
    return { o: o, n: n };
  }
};

export default Diff;