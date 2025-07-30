import React from "react";
import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer className="p-10 bg-[#e2e2e2] text-black flex flex-col md:flex-row justify-between flex-wrap gap-8">
      {/* About Us */}
      <div className="max-w-xs">
        <h6 className="font-semibold mb-2 text-gray-800">About Us</h6>
        <p className="text-sm text-gray-600">
          We are a team of passionate developers committed to delivering
          high-quality content and services. Our focus is on innovation and
          customer satisfaction.
        </p>
      </div>

      {/* Quick Links */}
      <nav>
        <h6 className="font-semibold mb-2 text-gray-800">Quick Links</h6>
        <ul className="flex flex-col gap-1 text-sm text-gray-600">
          <NavLink to="/" className="hover:text-orange-500">Home</NavLink>
          <NavLink to="/mypost" className="hover:text-orange-500">Blog</NavLink>
          <NavLink to="/about" className="hover:text-orange-500">About</NavLink>
          <NavLink to="/contact" className="hover:text-orange-500">Contact</NavLink>
        </ul>
      </nav>

      {/* Contact Us */}
      <nav>
        <h6 className="font-semibold mb-2 text-gray-800">Contact</h6>
        <ul className="flex flex-col gap-1 text-sm text-gray-600">
          <span>Email: info@example.com</span>
          <span>Phone: +123-456-7890</span>
          <span>123 Developer Lane, Code City</span>
        </ul>
      </nav>

      {/* Newsletter */}
      <form className="w-full sm:w-80">
        <h6 className="font-semibold mb-2 text-gray-800">Newsletter</h6>
        <fieldset className="form-control">
          <label className="label">
            <span className="label-text text-gray-600">Enter your email address</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="email"
              placeholder="username@site.com"
              className="input input-bordered w-full"
              required
            />
            <button className="bg-slate-500 text-white text-xs px-4 py-3 rounded-lg hover:bg-gray-800 transition">
              Subscribe
            </button>
          </div>
        </fieldset>
      </form>

      {/* Bottom Note */}
      <div className="mt-10 text-center w-full border-t pt-4 text-sm text-gray-500">
        © 2024 YourCompany. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
