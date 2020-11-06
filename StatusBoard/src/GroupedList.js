"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IGroupedList = void 0;
class IGroupedList {
    populate(items) {
        this.items = items;
    }
    getGroups(maxSize) {
        const groups = [];
        let items = this.items.slice();
        const groupMap = new Map();
        while (items.length > 0) {
            const item = items.shift();
            let group = this.createGroup(item);
            if (groupMap.has(group.key)) {
                group = groupMap.get(group.key);
                group.items.push(item);
            }
            else {
                groups.push(group);
                group.items = [item];
                groupMap.set(group.key, group);
                if (this.getSize(groups) > maxSize) {
                    groups.pop();
                    items.unshift(item);
                    return { groups, remainingItems: items };
                }
            }
            if (this.getSize(groups) > maxSize) {
                items.unshift(group.items.pop());
                return { groups, remainingItems: items };
            }
        }
        return { groups, remainingItems: [] };
    }
}
exports.IGroupedList = IGroupedList;
