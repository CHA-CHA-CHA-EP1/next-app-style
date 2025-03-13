export type Client = {
  id: number;
  name: string;
  login_code: string;
  postBoxId: number;
  ipAddress: string;
  subnetMask: string;
  geteway: string;
  type: string;
  lastUpdate: string;
  postBox: {
    id: number;
    name: string;
  };
};

export type CreateClient = {
  name: string;
  ipAddress: string;
  subnetMask: string;
  geteway: string;
  postBoxId?: number;
  type: string;
};
