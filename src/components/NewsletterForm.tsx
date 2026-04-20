"use client";

export default function NewsletterForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.currentTarget.reset();
  };

  return (
    <form
      className="flex gap-3 max-w-md mx-auto flex-wrap justify-center"
      onSubmit={handleSubmit}
    >
      <input
        type="email"
        required
        placeholder="Your email address"
        className="flex-1 min-w-[200px] px-4 py-3 rounded-xl border-none outline-none text-sm bg-white/90 text-gray-900"
      />
      <button type="submit" className="btn-primary py-3 px-6">
        Subscribe
      </button>
    </form>
  );
}