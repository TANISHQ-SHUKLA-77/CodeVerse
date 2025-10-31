export const fetchLocation = async () => {
  const response = await fetch("http://ip-api.com/json/?fields=country");
  const location = await response.json();
  return location.country;
};

export const fetchCountries = async () => {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name"
    );
    const result = await response.json();
    return result;
  } catch (error) {
    return [];
  }
};

export const fetchJobs = async (
  filters: JobFilterParams & { country?: string }
) => {
  const { query, page, country = "in" } = filters;

  const headers = {
    "X-RapidAPI-Key": process.env.RAPID_API_KEY ?? "",
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
  };

  const response = await fetch(
    `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(
      query
    )}&page=${page}&country=${country}`,
    {
      headers,
    }
  );

  const result = await response.json();

  return result.data;
};
