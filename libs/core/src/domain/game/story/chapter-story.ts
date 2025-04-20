interface StoryChapterProps {
  storyId?: string;
  touristSpotId?: string;
  chapterNumber?: string;
  chapterTitle?: string;
  chapterDesc?: string;
  chapterImage?: string;
  characterNameList?: string[];
  realWorldImage?: string;
  chapterVideoUrl?: string;
  chapterVideoMobileUrl?: string;
  chapterPdfUrl?: string;
  isUnlocked?: boolean;
  delFlag?: boolean;
  insUserId: string;
  insDateTime: Date;
  updUserId: string;
  updDateTime: Date;
  requestId?: string;
}

export class StoryChapter {
  private props: StoryChapterProps;

  constructor(props: StoryChapterProps) {
    this.props = props;
  }

  get storyId(): string | undefined {
    return this.props.storyId;
  }

  get touristSpotId(): string | undefined {
    return this.props.touristSpotId;
  }

  get chapterNumber(): string | undefined {
    return this.props.chapterNumber;
  }

  get chapterTitle(): string | undefined {
    return this.props.chapterTitle;
  }

  get chapterDesc(): string | undefined {
    return this.props.chapterDesc;
  }

  get chapterImage(): string | undefined {
    return this.props.chapterImage;
  }

  get characterNameList(): string[] | undefined {
    return this.props.characterNameList;
  }

  get realWorldImage(): string | undefined {
    return this.props.realWorldImage;
  }

  get chapterVideoUrl(): string | undefined {
    return this.props.chapterVideoUrl;
  }

  get chapterVideoMobileUrl(): string | undefined {
    return this.props.chapterVideoMobileUrl;
  }

  get chapterPdfUrl(): string | undefined {
    return this.props.chapterPdfUrl;
  }

  get isUnlocked(): boolean | undefined {
    return this.props.isUnlocked;
  }

  get delFlag(): boolean | undefined {
    return this.props.delFlag;
  }

  get insUserId(): string {
    return this.props.insUserId;
  }

  get insDateTime(): Date {
    return this.props.insDateTime;
  }

  get updUserId(): string {
    return this.props.updUserId;
  }

  get updDateTime(): Date {
    return this.props.updDateTime;
  }

  get requestId(): string | undefined {
    return this.props.requestId;
  }
}
