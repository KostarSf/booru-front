export function createSearchParams(query: string, sort: string, order: string) {
  return {
    q: query,
    sf: sort,
    sd: order,
  };
}

export function getSearchParams(params: URLSearchParams) {
  return {
    q: params.get("q"),
    sf: params.get("sf"),
    sd: params.get("sd"),
  };

}
