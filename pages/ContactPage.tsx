
import React, { useState } from 'react';
import Button from '../components/Button';

const ContactPage: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-8">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Get In Touch
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-muted">
          Have questions, feedback, or partnership inquiries? We'd love to hear from you.
        </p>
      </div>

        {submitted ? (
            <div className="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-xl text-center animate-fade-in">
                <strong className="font-bold">Thank you!</strong>
                <span className="block sm:inline"> Your message has been sent. We'll get back to you soon.</span>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="p-6 bg-gray-100 dark:bg-brand-surface/60 backdrop-blur-lg dark:border dark:border-white/10 rounded-xl space-y-6 animate-fade-in">
                <div className="grid md:grid-cols-2 gap-6">
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-brand-muted">Full Name</label>
                        <input type="text" name="name" id="name" required className="mt-1 w-full bg-white dark:bg-brand-bg border border-gray-300 dark:border-brand-surface focus:border-brand-blue focus:ring-brand-blue rounded-md p-2 text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-brand-muted">Email Address</label>
                        <input type="email" name="email" id="email" required className="mt-1 w-full bg-white dark:bg-brand-bg border border-gray-300 dark:border-brand-surface focus:border-brand-blue focus:ring-brand-blue rounded-md p-2 text-gray-900 dark:text-white" />
                    </div>
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-brand-muted">Message</label>
                    <textarea name="message" id="message" rows={5} required className="mt-1 w-full bg-white dark:bg-brand-bg border border-gray-300 dark:border-brand-surface focus:border-brand-blue focus:ring-brand-blue rounded-md p-2 text-gray-900 dark:text-white"></textarea>
                </div>
                <div className="text-right">
                    <Button type="submit" variant="primary">Send Message</Button>
                </div>
            </form>
        )}
    </div>
  );
};

export default ContactPage;
