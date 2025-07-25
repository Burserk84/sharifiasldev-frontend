"use client";

import Image from "next/image";
import type { Session } from "next-auth";

interface DashboardHeaderProps {
  session: Session;
  onSelectView: (view: string) => void;
}

// A simple component for the action buttons
function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors"
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

export default function DashboardHeader({
  session,
  onSelectView,
}: DashboardHeaderProps) {
  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  // Use the image from the session, or a placeholder if it doesn't exist
  const coverImageUrl = session.user?.coverImage?.url
    ? `${STRAPI_URL}${session.user.coverImage.url}`
    : "https://placehold.co/1200x300/1f2937/f97616?text=Cover+Image";

  const profilePictureUrl = session.user?.profilePicture?.url
    ? `${STRAPI_URL}${session.user.profilePicture.url}`
    : `https://ui-avatars.com/api/?name=${
        session.user?.firstName || session.user?.username
      }&background=2563eb&color=fff`;

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Cover Image */}
      <div className="relative w-full h-48 bg-gray-700">
        <Image
          src={coverImageUrl}
          alt="Cover photo"
          fill
          sizes="100vw" // Add sizes prop
          className="object-cover"
        />
      </div>

      <div className="p-6">
        {/* Avatar and Main Info */}
        <div className="flex items-end -mt-24">
          <div className="relative w-32 h-32 border-4 border-gray-800 rounded-full overflow-hidden bg-gray-900">
            <Image
              src={profilePictureUrl}
              alt="Profile picture"
              fill
              sizes="128px" // Add sizes prop
              className="object-cover"
            />
          </div>
          <div className="mr-4">
            <h2 className="text-2xl font-bold text-white">
              {session.user?.firstName && session.user?.lastName
                ? `${session.user.firstName} ${session.user.lastName}`
                : session.user?.username}
            </h2>
            <p className="text-sm text-gray-400">{session.user?.email}</p>
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex justify-end gap-x-6 mt-4 border-t border-gray-700 pt-4">
          <ActionButton
            onClick={() => onSelectView("profile")}
            label="ویرایش پروفایل"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM11.5 15.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
              </svg>
            }
          />
          <ActionButton
            onClick={() => onSelectView("password")}
            label="تغییر رمز عبور"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
}
