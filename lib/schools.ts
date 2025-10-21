export const SCHOOLS = [
  {
    id: "asu",
    name: "Arizona State University (ASU)",
    domain: "asu.edu",
    curricula: [
      { id: "web101", name: "Web Dev 101 (HTML/CSS/JS)" },
      { id: "ecom", name: "E-Commerce Fundamentals" },
      { id: "entre", name: "Entrepreneurship for Creators" },
    ],
  },
  {
    id: "uofa",
    name: "University of Arizona (UArizona)",
    domain: "arizona.edu",
    curricula: [
      { id: "wpbuilder", name: "WordPress Builder Lab" },
      { id: "marketing", name: "Digital Marketing Basics" },
    ],
  },
  {
    id: "nau",
    name: "Northern Arizona University (NAU)",
    domain: "nau.edu",
    curricula: [
      { id: "cloud", name: "Cloud Hosting Essentials" },
      { id: "design", name: "No-Code Site Design Studio" },
    ],
  },
  {
    id: "other",
    name: "My school isn't listed",
    domain: "",
    curricula: [{ id: "general", name: "General Track" }],
  },
] as const;

export type School = typeof SCHOOLS[number];
export type Curriculum = School['curricula'][number];
