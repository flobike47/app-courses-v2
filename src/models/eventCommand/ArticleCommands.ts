export class ArticleCommands {

    static RELOAD(id: number): string {
        return `RELOAD_ARTICLE_${id}`;
    }
    static readonly OPEN_CREATION = "OPEN_ARTICLE_CREATION_MODAL"

}