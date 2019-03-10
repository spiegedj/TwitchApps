export interface IGroup<Item>
{
    items: Item[];
    key: string;
}

export class IGroupedList<Group extends IGroup<Item>, Item>
{
    private items: Item[];

    public createGroup: (item: Item) => Group;
    public isGrouped: (a: Item, b: Item) => boolean;
    public getSize: (g: Group[]) => number;

    public populate(items: Item[])
    {
        this.items = items;
    }

    public getGroups(maxSize: number): Group[]
    {
        const groups: Group[] = [];
        let items = this.items.slice();

        const groupMap: Map<string, Group> = new Map();

        while (items.length > 0)
        {
            const item = items.shift();
            let group = this.createGroup(item);
            if (groupMap.has(group.key))
            {
                group = groupMap.get(group.key);
                group.items.push(item);
            }
            else
            {
                groups.push(group);
                group.items = [item];

                groupMap.set(group.key, group);
                if (this.getSize(groups) > maxSize)
                {
                    groups.pop();
                    return groups;
                }
            }

            if (this.getSize(groups) > maxSize)
            {
                group.items.pop();
                return groups;
            }
        }

        return groups;
    }
}