"use client";

export default function PrivacyChoicesButton() {
  return <button type="button" onClick={() => window.dispatchEvent(new Event("cognora:privacy-choices"))} className="ml-2 underline underline-offset-2 hover:text-primary">Privacy choices</button>;
}
