/*
 * This file contains the Map of word --> token substitutions.
 */

/* exported sortedTokenMap */

let dictionary = new Map();
//dictionary.set(':GloveboxSecureKeyTokenFromAcceptedOfferToken:', '<mark>;🍎GloveboxSecureKeyTokenFromAcceptedOfferToken:</mark>');
dictionary.set(':GloveboxSecureKeyTokenFromAcceptedOfferToken:[^:]*:', '⚾⚾⚾');
dictionary.set(':GloveboxSecureKeyOfferToken:[^:]*:', '🍌');
dictionary.set(':GloveboxAcceptedSecureKeyOfferToken:[^:]*:', '💥');
dictionary.set(':GloveboxOpenKeyToken:[^:]*:', '⚾');
dictionary.set(':Glovebox:[^:]*:[^:]*:', '⚾');
//dictionary.set('bike', '🚴');




/*

*dictionary.set('GloveboxSecureKeyTokenFromAcceptedOfferToken', '🍎');
*dictionary.set('GloveboxSecureKeyOfferToken', '💣');
*dictionary.set('GloveboxAcceptedSecureKeyOfferToken', '🍺');
*dictionary.set('GloveboxOpenKeyToken', '👧');

* After all the dictionary entries have been set, sort them by length.
 *
 * Because iteration over Maps happens by insertion order, this avoids
 * scenarios where words that are substrings of other words get substituted
 * first, leading to the longer word's substitution never triggering.
 * 
 * For example, the 'woman' substitution would never get triggered
 * if the 'man' substitution happens first because the input term 'woman'
 * would become 'wo👨', and the search for 'woman' would not find any matches.
 */
let tempArray = Array.from(dictionary);
tempArray.sort((pair1, pair2) => {
  // Each pair is an array with two entries: a word, and its token.
  // Ex: ['woman', '👩']
  const firstWord = pair1[0];
  const secondWord = pair2[0];

  if (firstWord.length > secondWord.length) {
    // The first word should come before the second word.
    return -1;
  }
  if (secondWord.length > firstWord.length) {
    // The second word should come before the first word.
    return 1;
  }

  // The words have the same length, it doesn't matter which comes first.
  return 0;
});

// Now that the entries are sorted, put them back into a Map.
//console.log(tempArray);

let sortedTokenMap = new Map(tempArray);
