import { Link } from "react-router-dom";



export const AboutPage = () => {
  document.title = 'About E-Prescriptions';
  return (
    <>
      <nav
        className="nhsuk-contents-list"
        role="navigation"
        aria-label="Pages in this guide"
      >
        <h2 className="nhsuk-u-visually-hidden">Contents</h2>
        <ol className="nhsuk-contents-list__list">
          <li className="nhsuk-contents-list__item" aria-current="page">
            <span className="nhsuk-contents-list__current">About the service</span>
          </li>
          <li className="nhsuk-contents-list__item">
            <a className="nhsuk-contents-list__link" href="#technologies">
              Technologies and Libraries
            </a>
          </li>
          <li className="nhsuk-contents-list__item">
            <a className="nhsuk-contents-list__link" href="#licenses">
                Licenses
            </a>
          </li>
        </ol>
      </nav>
      <div>
        <h1>About the service</h1>
        <p>
          This is an online service that allows you to view and manage your
          prescriptions. You can see what prescriptions you currently have, when
          they are due for renewal, and request new prescriptions all in one
          place.
        </p>
        <p>You can use this service if you:</p>
        <ul>
          <li>live in Wales</li>
          <li>are registered with a GP that uses this tool</li>
          <li>have a pharmacy near you that uses this tool</li>
        </ul>

        <h2>Before you start</h2>
        <p>
          You will need to <Link to="/register">register</Link> for an account
          before you can use this service. It is a simple process that only
          requires some basic details about you.
        </p>
        <p>
          Once you have created an account, you will need to be added to the
          system by your GP.
        </p>
        <p>
          By using this service you are agreeing to our{" "}
          <Link to="/terms">terms of use</Link> and{" "}
          <Link to="/privacy">privacy policy</Link>.
        </p>

        <h2>Mission Statement</h2>
        <p>
          Our mission is to transform the way prescriptions are managed in Wales
          by providing a seamless, efficient, and user-friendly online platform
          that connects patients, doctors, and pharmacies. We aim to streamline
          the prescription process, reduce wait times, and enhance patient care
          through digital solutions.
        </p>

        <h2>Project Origin and Development</h2>
        <p>
          The e-prescription project was initiated to address the inefficiencies
          in the traditional prescription process. Recognizing the challenges
          faced by patients and healthcare providers, we developed this platform
          to simplify and accelerate the prescription management process,
          ensuring that patients receive their medications promptly and
          securely.
        </p>

        <h2>Team Introduction</h2>
        <p>
          Our project was born from a collaboration between ambitious computer
          science students at Cardiff University and the National Health Service
          (NHS). Inspired to make a real-world impact, our team sought to
          address the pressing need for streamlined healthcare processes.
          Working closely with the NHS, we were able to bring our innovative
          ideas to life
        </p>

        <h2>Technological Innovations</h2>
        <p>
          We leverage state-of-the-art technology to ensure our service is at
          the forefront of digital healthcare solutions. Innovations such as
          real-time data processing, secure cloud storage, and automated systems
          are integral to our platform, enhancing the overall user experience
          and operational efficiency.
        </p>

        <h2>User Testimonials and Success Stories</h2>
        <p>
          Our service has received positive feedback from numerous users who
          have appreciated the convenience and efficiency it offers. Success
          stories from patients who have experienced significant improvements in
          managing their health regimes underscore the impact of our work.
        </p>

        <h2>Partnerships and Collaborations</h2>
        <p>
          We collaborate with leading healthcare organizations, technology
          partners, and academic institutions to continuously improve our
          service. These partnerships enable us to stay updated with the latest
          developments and integrate advanced features into our platform.
        </p>

        <h2>Future Goals and Vision</h2>
        <p>
          Looking ahead, we are focused on expanding our service to cover more
          regions and integrate additional features such as AI-driven
          recommendations and enhanced data analytics. Our goal is to establish
          this platform as the leading e-prescription service across the UK,
          setting new standards in healthcare technology.
        </p>

        <h2>Community and Social Responsibility</h2>
        <p>
          Our commitment extends beyond technology; we are dedicated to making a
          positive impact on community health. Initiatives include educational
          programs, support for underserved areas, and efforts to reduce
          environmental impact by minimizing paper use in the healthcare
          industry.
        </p>

        <h2>Regulatory Compliance</h2>
        <p>
          We adhere strictly to healthcare regulations and data protection laws,
          ensuring that our service is not only effective but also secure and
          compliant. Our commitment to maintaining the highest standards of
          privacy and security is unwavering.
        </p>

        <h2>Invitation to Feedback</h2>
        <p>
          We value the input of our users and encourage feedback to continually
          enhance our service. Please contact us with suggestions or comments.
          Together, we can make healthcare more accessible and efficient.
        </p>

        <p>
          This technology stack ensures that our e-prescription service is not
          only functional and efficient but also secure and compliant with
          current web standards. We've taken great care to select tools that
          align with our goals for scalability and maintainability.
        </p>
        <p>
          As we continue to develop and enhance our services, we remain
          committed to using cutting-edge technologies that facilitate the best
          possible experience for our users while ensuring data integrity and
          security.
        </p>

        <hr />

        <h1 id="technologies">Technologies and Libraries</h1>
        <p>
          Our project leverages a diverse set of libraries and technologies to
          ensure high performance, security, and user-friendly interfaces.
          Here's a deeper look into some of the major tools:
        </p>
        <ul>
          <li>
            <a href="https://github.com/facebook/react">
              <strong>React</strong>
            </a>{" "}
            - React is a tool that helps us create websites that are easy to
            interact with. It lets us build parts of our website—like buttons
            and forms—that you can use without slow loading times. This makes
            our e-prescription system quick and responsive, which is great when
            you need to manage your prescriptions efficiently.
          </li>
          <li>
            <a href="https://nhsuk.github.io/nhsuk-frontend/">
              <strong>NHS UK Frontend</strong>
            </a>{" "}
            - The NHS UK Frontend is a collection of design elements that ensure
            our website looks and functions in a way that's approved by the NHS.
            It helps us make sure that everything from buttons to forms is easy
            for everyone to use, no matter their ability. This is important
            because it makes our e-prescription service easy and safe for
            everyone to use.
          </li>
          <li>
            <a href="https://www.djangoproject.com/">
              <strong>Django</strong>
            </a>{" "}
            - Django is a tool that helps us build the behind-the-scenes part of
            our website quickly and with fewer mistakes. It handles everything
            from making sure users are who they say they are, to organizing and
            storing all the prescription information securely. Django helps keep
            our service running smoothly and securely, ensuring that your data
            is safe.
          </li>
          <li>
            <a href="https://www.django-rest-framework.org/">
              <strong>Django REST Framework</strong>
            </a>{" "}
            - The Django REST Framework is an extension of Django that makes it
            easier for our website to communicate with the internet. It helps
            organize and send information back and forth between the user's
            screen and our database. This means whenever you request to view or
            update your prescriptions, it handles that efficiently.
          </li>
          <li>
            <a href="https://www.postgresql.org/">
              <strong>PostgreSQL</strong>
            </a>{" "}
            - PostgreSQL is a system that stores all the data for our service,
            like user details and prescription records. It is known for being
            very reliable and good at handling lots of information at once,
            which is crucial for a service like ours where many people might be
            using it at the same time.
          </li>
          <li>
            <a href="https://github.com/axnsan12/drf-yasg">
              <strong>drf-yasg</strong>
            </a>{" "}
            - drf-yasg is a tool that helps us create a guide for our website’s
            behind-the-scenes features. It automatically generates documentation
            that is easy to navigate and understand, which is especially useful
            for developers who need to work with or expand our system. It
            ensures anyone who needs to understand how our system works can do
            so easily, which is important for maintaining and improving our
            service.
          </li>
        </ul>

        <hr />
        <h1 id="licenses">Licenses</h1>
        <p>The above software requires the redistribution of their license:</p>
        <h2>MIT</h2>
        <pre>
          MIT License Copyright (c) Meta Platforms, Inc. and affiliates.
          Permission is hereby granted, free of charge, to any person obtaining
          a copy of this software and associated documentation files (the
          "Software"), to deal in the Software without restriction, including
          without limitation the rights to use, copy, modify, merge, publish,
          distribute, sublicense, and/or sell copies of the Software, and to
          permit persons to whom the Software is furnished to do so, subject to
          the following conditions: The above copyright notice and this
          permission notice shall be included in all copies or substantial
          portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT
          WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
          THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
          AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
          HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
          IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
          IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
          SOFTWARE.
        </pre>

        <h2>BSD-3-Clause</h2>
        <pre>
          Copyright (c) Django Software Foundation and individual contributors.
          All rights reserved.
        </pre>
        <pre>
          Copyright © 2011-present, Encode OSS Ltd. All rights reserved.
        </pre>
        <pre>
          Copyright (c) 2017 - 2019, Cristian V.{" "}
          <a href="mailto:cristi@cvjd.me">cristi@cvjd.me</a> All rights
          reserved.
        </pre>
        <pre>
          Redistribution and use in source and binary forms, with or without
          modification, are permitted provided that the following conditions are
          met: 1. Redistributions of source code must retain the above copyright
          notice, this list of conditions and the following disclaimer. 2.
          Redistributions in binary form must reproduce the above copyright
          notice, this list of conditions and the following disclaimer in the
          documentation and/or other materials provided with the distribution.
          3. Neither the name of Django nor the names of its contributors may be
          used to endorse or promote products derived from this software without
          specific prior written permission. THIS SOFTWARE IS PROVIDED BY THE
          COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
          WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
          MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
          IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
          ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
          DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
          GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
          INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
          IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
          OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
          ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
        </pre>

        <h2>PostgreSQL License</h2>
        <pre>
          PostgreSQL Database Management System (formerly known as Postgres,
          then as Postgres95)
        </pre>
        <pre>
          Portions Copyright © 1996-2024, The PostgreSQL Global Development
          Group
        </pre>
        <pre>
          Portions Copyright © 1994, The Regents of the University of
          California
        </pre>
        <pre>
          Permission to use, copy, modify, and distribute this software and its
          documentation for any purpose, without fee, and without a written
          agreement is hereby granted, provided that the above copyright notice
          and this paragraph and the following two paragraphs appear in all
          copies. IN NO EVENT SHALL THE UNIVERSITY OF CALIFORNIA BE LIABLE TO
          ANY PARTY FOR DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL
          DAMAGES, INCLUDING LOST PROFITS, ARISING OUT OF THE USE OF THIS
          SOFTWARE AND ITS DOCUMENTATION, EVEN IF THE UNIVERSITY OF CALIFORNIA
          HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. THE UNIVERSITY OF
          CALIFORNIA SPECIFICALLY DISCLAIMS ANY WARRANTIES, INCLUDING, BUT NOT
          LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
          A PARTICULAR PURPOSE. THE SOFTWARE PROVIDED HEREUNDER IS ON AN "AS IS"
          BASIS, AND THE UNIVERSITY OF CALIFORNIA HAS NO OBLIGATIONS TO PROVIDE
          MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR MODIFICATIONS.
        </pre>
      </div>
    </>
  );
};
