function Footer() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const timeZone = "WAT";

  return (
    <footer
      id="Footer"
      className="w-full py-16 text-center rounded-t-3xl bg-blue-600"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-2 gap-8">
          {/* Menu Section */}
          <div>
            <h3 className="font-medium text-md text-white md:text-lg mb-4">
              Menu
            </h3>
            <div className="h-px w-full bg-white mb-4"></div>
            <ul className="space-y-1 font-light text-white cl-effect-5">
              {[
                { text: "Home", id: "Home" },
                { text: "About", id: "About" },
                { text: "What we offer", id: "What we offer" },
                { text: "Leadership", id: "Leadership" },
                { text: "Careers", id: "Careers" },
              ].map((item, index) => (
                <li key={index} className="w-full touch-auto">
                  <a
                    href={`#${item.id}`}
                    className="block w-full py-2 touch-auto"
                  >
                    <span data-hover={item.text} className="block">
                      {item.text}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials Section */}
          <div>
            <h3 className="font-medium text-md md:text-lg text-white font-space-mono mb-4">
              Community
            </h3>
            <div className="h-px w-full bg-white mb-4"></div>
            <ul className="space-y-1 font-light text-white cl-effect-5">
              {[
                {
                  text: "Learners",
                },
                {
                  text: "Partners",
                },
                { text: "Beta Testers" },
                { text: "Blog" },
              ].map((social, index) => (
                <li key={index} className="w-full touch-auto">
                  <a
                    href={social.href}
                    className="block w-full py-2 touch-auto"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span data-hover={social.text} className="block">
                      {social.text}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright and Time Section */}
        <div className="flex flex-col mt-10 md:flex-row gap-4 justify-between lg:px-64">
          <div className="">
            <p className="uppercase text-md md:text-lg font-bold mb-1">
              LOCAL TIME
            </p>
            <p className="font-mono font-normal text-white">{`${hours}:${minutes}, ${timeZone}`}</p>
          </div>
          <div className="text-md md:text-lg text-white font-bold">
            <p>© 2025 Adeola Oladeinde</p>
            <p>All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
