import { TabHeaderDirective, TabContentDirective } from '../directives';

export class Tab {
    public id: string;
    public header: TabHeaderDirective;
    public content: TabContentDirective;
    public index: number;

    constructor(header: TabHeaderDirective, content: TabContentDirective) {
        this.id = header.appTabHeader;
        this.header = header;
        this.content = content;

        // So that the header and content isActive properties are always in sync.
        this.header.isActiveChange
            .subscribe(() => this.content.isActive = this.isActive);
    }

    // Saves accessing .header.isActive every time.
    public get isActive(): boolean {
        return this.header.isActive;
    }

    public set isActive(active: boolean) {
        // Use `setActiveState` so as not to fire 'external changes' event.
        this.header.setActiveState(active);
    }

    // Saves accessing .header.isDisabled every time.
    public get isDisabled(): boolean {
        return this.header.isDisabled;
    }
}
