export interface IStatuses {
  forbidden: number;
  invalid: number;
  success: number;
  created: number;
  server_error: number;
  not_found: number;
  too_many_requests: number;
  unauthorized: number;
  unprocassable_entity: number;
}

export const statuses: IStatuses = {
  forbidden: 403,
  invalid: 400,
  not_found: 404,
  server_error: 500,
  success: 200,
  created: 201,
  too_many_requests: 427,
  unauthorized: 401,
  unprocassable_entity: 422,
};
