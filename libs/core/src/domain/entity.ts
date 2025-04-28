export abstract class Entity<T, ID = string | undefined> {
  protected props: T;
  protected readonly _id: ID;

  protected constructor(props: T, id: ID) {
    this.props = props;
    this._id = id;
  }

  get id(): ID {
    return this._id;
  }
}
