import uniqid from "uniqid";

export default class List {
  constructor() {
    this.items = [];
  }

  additem (count, unit, ingredients) {
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredients,
    }
    this.items.push(item);
    return item;
  };

  deleteItem (id) {
    const index = this.items.findIndex(el => el.id ===id);
    // splice mutates the arr
    this.items.splice(index, 1);
  };

  updateCount (id, newCount) {
    // find is similar to findIndex but returns the element
    this.items.find(el => el.id === id).count = newCount;
  }
}