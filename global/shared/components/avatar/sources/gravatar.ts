import { Source } from './source';
import { Md5 } from 'ts-md5/dist/md5';
import { Utils } from '@core/utils';

/**
 *  Gravatar source impelementation.
 *  Fetch avatar source based on gravatar email
 *
 * @export
 * @class Gravatar
 * @implements {Source}
 */
export class Gravatar implements Source {
    readonly sourceType: string = 'GRAVATAR';
    public sourceId: string;

    constructor(public value: string) {
        this.sourceId = value.match('^[a-f0-9]{32}$') ? value : Md5.hashStr(value).toString();
    }

    getAvatar(size: number): string {
        const avatarSize = Utils.isRetina() ? size * 2 : size;
        return `https://secure.gravatar.com/avatar/${this.sourceId}?s=${avatarSize}&d=404`;
    }
}
