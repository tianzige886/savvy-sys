export interface SubmitValuesType {
  username: string;
  password: string;
}
export interface CreateUserModalType {
  visible: boolean;
  onClose: () => void;
  onOk: (userInfo: SubmitValuesType) => void;
}
