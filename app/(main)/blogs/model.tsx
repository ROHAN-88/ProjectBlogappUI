export type CloudinaryResult = {
  info: {
    public_id: string;
    secure_url: string;
    [key: string]: any;
  };
  event: string;
};

export type categoryType =
  | "animal"
  | "recent"
  | "sports"
  | "entertainment"
  | "travel"
  | "food"
  | "fashion"
  | "fitness"
  | "health"
  | "business"
  | "other";

export type FormDataType = {
  title: string;
  text: string;
  category: categoryType;

  imageUrl: string;
};
