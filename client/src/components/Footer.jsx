// src/components/Footer.jsx
import { motion } from "framer-motion";
import {
  FiFacebook,
  FiTwitter,
  FiLinkedin,
  FiMail,
  FiPhone,
  FiMapPin,
  FiHeart,
} from "react-icons/fi";

const Footer = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const socialIconVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 12,
      },
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.footer
      className="bg-[#10B981] text-white py-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <motion.div
        className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Brand Section */}
        <motion.div className="space-y-4" variants={itemVariants}>
          <h2 className="text-2xl font-bold text-white">Pratibha Kosh</h2>
          <p className="text-sm leading-relaxed text-white opacity-90">
            One Platform for All Student Achievements – empowering students,
            faculty, and institutions with analytics, reports, and AI career
            guidance.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div className="space-y-4" variants={itemVariants}>
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            {[
              { name: "Home", href: "/" },
              { name: "Get Started", href: "/auth/signup" },
              { name: "Student Search", href: "/student-search" },
              { name: "Contact", href: "/contact" },
            ].map((link, index) => (
              <motion.li
                key={index}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <a
                  href={link.href}
                  className="hover:text-gray-100 transition-colors duration-200 block"
                >
                  {link.name}
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Contact Info */}
        <motion.div className="space-y-4" variants={itemVariants}>
          <h3 className="text-lg font-semibold text-white">Contact</h3>
          <ul className="space-y-3 text-sm">
            <motion.li
              className="flex items-center gap-3"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <FiMail className="text-white opacity-90" />
              <span className="opacity-90">support@pratibha-kosh.com</span>
            </motion.li>
            <motion.li
              className="flex items-center gap-3"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <FiPhone className="text-white opacity-90" />
              <span className="opacity-90">+91 9939261969</span>
            </motion.li>
            <motion.li
              className="flex items-center gap-3"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <FiMapPin className="text-white opacity-90" />
              <span className="opacity-90">New Delhi, India</span>
            </motion.li>
          </ul>
        </motion.div>

        {/* Social Media */}
        <motion.div className="space-y-4" variants={itemVariants}>
          <h3 className="text-lg font-semibold text-white">Follow Us</h3>
          <div className="flex gap-4">
            {[
              { icon: FiFacebook, label: "Facebook", href: "#" },
              { icon: FiTwitter, label: "Twitter", href: "#" },
              { icon: FiLinkedin, label: "LinkedIn", href: "#" },
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                className="group p-3 bg-black bg-opacity-10 rounded-full transition-all duration-200 hover:bg-opacity-20"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5 text-white group-hover:text-green-500 transition-colors duration-150" />
              </a>
            ))}
          </div>
          <motion.p
            className="text-sm opacity-80 mt-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            viewport={{ once: true }}
          >
            Connect with us for updates and news
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Bottom Bar */}
      <motion.div
        className="max-w-6xl mx-auto px-6 mt-10 pt-6 border-t border-white border-opacity-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <motion.div
            className="text-white opacity-80"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            © {new Date().getFullYear()} Pratibha Kosh. All Rights Reserved.
          </motion.div>
          <motion.div
            className="flex items-center gap-1 text-white opacity-80"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Made with <FiHeart className="text-red-400 mx-1 animate-pulse" />{" "}
            for education
          </motion.div>
        </div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
