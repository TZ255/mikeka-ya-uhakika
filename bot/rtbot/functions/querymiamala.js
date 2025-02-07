const miamalaModel = require('../database/miamala')

async function findMuamala(fullName) {
    const nameParts = fullName.trim().split(/\s+/);
    let query = {};
  
    if (nameParts.length === 2) {
      const [first, second] = nameParts;
      query = {
        $or: [
          // Match a two-name document: "first second"
          { name: new RegExp(`^${first}\\s+${second}$`, 'i') },
          // Match a three-name document where the first and last tokens match: "first <anything> second"
          { name: new RegExp(`^${first}\\s+\\w+\\s+${second}$`, 'i') },
          // Match a three-name document where the first two tokens match: "first second <anything>"
          { name: new RegExp(`^${first}\\s+${second}\\s+\\w+$`, 'i') }
        ]
      };
    } else if (nameParts.length === 3) {
      const [first, middle, last] = nameParts;
      query = {
        $or: [
          // Match a three-name document: "first middle last"
          { name: new RegExp(`^${first}\\s+${middle}\\s+${last}$`, 'i') },
          // Match a two-name document: "first middle" (user might have omitted the last name)
          { name: new RegExp(`^${first}\\s+${middle}$`, 'i') },
          // Match a two-name document: "first last" (user might have omitted the middle name)
          { name: new RegExp(`^${first}\\s+${last}$`, 'i') }
        ]
      };
    } else {
      // Fallback: for names that don't have exactly 2 or 3 tokens,
      // perform a case-insensitive search for the provided string anywhere in fullName.
      query = { name: new RegExp(fullName, 'i') };
    }
  
    // Await the query execution and return the result.
    const user_tx = await miamalaModel.find(query);
    return user_tx;
  }

  module.exports = findMuamala