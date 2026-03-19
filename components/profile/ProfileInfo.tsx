type Props = {
  displayName: string;
  email: string | null;
  photoURL: string | null;
};

export function ProfileInfo({ displayName, email, photoURL }: Props) {
  const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    displayName
  )}&background=1E40AF&color=fff&size=112`;

  return (
    <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Avatar */}
      <div className="p-1 rounded-full border-4 border-emerald-400 dark:border-emerald-500 shadow-md">
        <img
          src={photoURL ?? "/images/profile-placeholder.png"}
          alt={displayName}
          className="w-28 h-28 rounded-full object-cover bg-gray-200 dark:bg-muted"
          onError={(e) => {
            (e.target as HTMLImageElement).src = avatarFallback;
          }}
        />
      </div>

      {/* Name */}
      <h2 className="text-2xl font-bold text-gray-800 dark:text-foreground mt-3">
        {displayName}
      </h2>

      {/* Email */}
      <p className="text-gray-500 dark:text-muted-foreground mt-1 text-base">
        {email ?? "No email"}
      </p>

      {/* Role badge */}
      <span className="mt-2 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-medium px-4 py-1.5 rounded-full">
        Volunteer
      </span>
    </div>
  );
}