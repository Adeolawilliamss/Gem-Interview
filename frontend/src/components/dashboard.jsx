import { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialCourses = [
  {
    id: "html",
    title: "HTML Basics",
    image: "Html Basics.jpg",
    alt: "HTML",
    skills: "HTML tags, structure, semantic elements, accessibility",
    description:
      "In this course, you'll learn how to structure content on the web using HTML. You'll cover essential tags, elements, attributes, semantic HTML, and best practices for writing clean, accessible markup that forms the foundation of every web page.",
    lessons: ["Introduction", "Tags & Elements", "Semantic HTML", "Forms"],
  },
  {
    id: "css",
    title: "CSS Basics",
    image: "Css basics.jpg",
    alt: "CSS",
    skills: "Selectors, box model, Flexbox, Grid, responsive design",
    description:
      "This course teaches you how to style web pages using CSS. You'll explore CSS syntax, selectors, properties, colors, spacing, Flexbox, Grid, and responsive design techniques to make your sites look great on any device.",
    lessons: ["Selectors", "Box Model", "Flexbox", "Grid", "Media Queries"],
  },
  {
    id: "js",
    title: "JavaScript Basics",
    image: "Javascript basics.png",
    alt: "JavaScript",
    skills: "Variables, functions, DOM, events, loops, conditionals",
    description:
      "Learn how to bring interactivity to your websites using JavaScript. This course covers fundamentals like variables, data types, functions, conditionals, loops, and DOM manipulation. You'll also learn how to handle events to create dynamic user experiences.",
    lessons: ["Selectors", "Box Model", "Flexbox", "Grid", "Media Queries"],
  },
  {
    id: "ts",
    title: "TypeScript Basics",
    image: "Typescript basics.jpg",
    alt: "TypeScript",
    skills: "Types, interfaces, type safety, code scalability",
    description:
      "This course introduces TypeScript — a statically typed superset of JavaScript. You'll learn how to use types, interfaces, and advanced type features to write more reliable, maintainable code that scales well in large applications.",
    lessons: ["Selectors", "Box Model", "Flexbox", "Grid", "Media Queries"],
  },
];

export default function Dashboard() {
  const [progress, setProgress] = useState({});
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const navigate = useNavigate();

  const handleEnroll = (courseId) => {
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses((prev) => [...prev, courseId]);
    }
  };

  const handleViewCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div id="Dashboard" className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Available Courses</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {initialCourses.map((course) => {
          const isEnrolled = enrolledCourses.includes(course.id);
          return (
            <div
              key={course.id}
              className="bg-white p-6 rounded-lg shadow transition-transform duration-300 hover:shadow-xl hover:scale-[1.02]"
            >
              <img
                src={course.image}
                alt={course.alt}
                className="w-full h-[14rem]"
              />
              <h2 className="text-lg font-semibold mb-2">{course.title}</h2>
              <h3 className="text-md font-semibold">Skills You'll gain:</h3>
              <p>{course.skills}</p>
              <p className="text-gray-600 mb-4 mt-5">{course.description}</p>
              {isEnrolled ? (
                <div className="mt-4">
                  <h4 className="font-semibold mb-1">Progress</h4>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{
                          width: `${
                            Math.floor(
                              ((progress[course.id]?.length || 0) /
                                course.lessons.length) *
                                100
                            ) || 0
                          }%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-sm text-green-700 font-medium mt-1">
                      Progress:{" "}
                      {Math.floor(
                        ((progress[course.id]?.length || 0) /
                          course.lessons.length) *
                          100
                      )}
                      %
                    </div>
                  </div>

                  {/* Lessons */}
                  <ul className="list-disc pl-5 text-sm text-gray-700">
                    {course.lessons.map((lesson, index) => {
                      const isCompleted = progress[course.id]?.includes(index);
                      return (
                        <li key={index}>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={isCompleted}
                              onChange={() => {
                                setProgress((prev) => {
                                  const prevLessons = prev[course.id] || [];
                                  const updated = prevLessons.includes(index)
                                    ? prevLessons.filter((i) => i !== index)
                                    : [...prevLessons, index];
                                  return { ...prev, [course.id]: updated };
                                });
                              }}
                            />
                            <span>{lesson}</span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>

                  {/* View Course Button */}
                  <button
                    onClick={() => handleViewCourse(course.id)}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    View Course
                  </button>
                </div>
              ) : (
                // Enroll Button
                <button
                  onClick={() => handleEnroll(course.id)}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Enroll
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
