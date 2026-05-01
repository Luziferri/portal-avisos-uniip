
      const { useEffect, useMemo, useRef, useState } = React;

      const SUPABASE_URL = "https://bgerpvpmngunuqvllnmy.supabase.co";
      const SUPABASE_ANON_KEY =
        "sb_publishable_Q-s7cUs4is8Kp9v4sYxc3g_QdOfW8LI";
      const supabaseClient =
        SUPABASE_URL &&
        SUPABASE_ANON_KEY &&
        !SUPABASE_ANON_KEY.startsWith("PASTE_YOUR")
          ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
          : null;

      const schoolConfig = {
        ESE: {
          label: "ESE",
          name: "Escola Superior de Educação",
          classes: "bg-sky-50 text-sky-800 border-sky-200",
          badge: "bg-sky-700",
        },
        EST: {
          label: "EST",
          name: "Escola Superior de Tecnologia",
          classes: "bg-slate-100 text-slate-800 border-slate-300",
          badge: "bg-slate-700",
        },
        ESS: {
          label: "ESS",
          name: "Escola Superior de Saúde",
          classes: "bg-emerald-50 text-emerald-800 border-emerald-200",
          badge: "bg-emerald-700",
        },
        ESCE: {
          label: "ESCE",
          name: "Escola Superior de Ciências Empresariais",
          classes: "bg-amber-50 text-amber-800 border-amber-200",
          badge: "bg-amber-700",
        },
      };

  const categoryConfig = {
  Evento: { label: "Evento", tone: "bg-ink-900 text-white" },
  Voluntariado: { label: "Voluntariado", tone: "bg-accent-600 text-white" },
  "Aviso Académico": { label: "Aviso Académico", tone: "bg-coral-500 text-white" },
  // NOVAS CATEGORIAS:
  Erasmus: { label: "Erasmus", tone: "bg-blue-600 text-white" },
  AAIPS: { label: "AAIPS", tone: "bg-orange-500 text-white" },
  Empregabilidade: { label: "Empregabilidade", tone: "bg-emerald-600 text-white" },
  Biblioteca: { label: "Biblioteca", tone: "bg-violet-600 text-white" },
  Hackathon: { label: "Hackathon", tone: "bg-fuchsia-600 text-white" },
};

      // Real announcements loaded from Supabase - see loadAnnouncements()

      const mockAccounts = {
        professor: {
          role: "Professor",
          name: "Prof.Armando Silva",
          email: "professor@uniip.pt",
          username: "professor",
          password: "prof123",
        },
        aluno: {
          role: "Aluno",
          name: "Armindo",
          email: "aluno@uniip.pt",
          username: "armindo",
          password: "aluno123",
        },
        secretaria: {
          role: "Secretaria",
          name: "Secretaria UNIIP",
          email: "secretaria@uniip.pt",
          username: "secretaria",
          password: "secret123",
        },
      };

      const formatDate = (value) =>
        new Intl.DateTimeFormat("pt-PT", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(new Date(value));

      const formatTime = (value) => (value ? String(value).slice(0, 5) : "");

      const formatEventTimeRange = (startTime, endTime) => {
        const start = formatTime(startTime);
        const end = formatTime(endTime);

        if (start && end) {
          return `${start} - ${end}`;
        }

        if (start) {
          return `A partir das ${start}`;
        }

        if (end) {
          return `Até ${end}`;
        }

        return "";
      };

      const formatMonthYear = (value) =>
        new Intl.DateTimeFormat("pt-PT", {
          month: "long",
          year: "numeric",
        }).format(value);

      const toDateKey = (value) => {
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, "0");
        const day = String(value.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const isExpired = (expiresAt) =>
        new Date(expiresAt).setHours(23, 59, 59, 999) < Date.now();

      const Icon = ({ children, className = "" }) => (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          {children}
        </svg>
      );

      const Sparkles = (props) => (
        <Icon {...props}>
          <path d="M9 3l1.8 3.9L15 9l-4.2 2.1L9 15l-1.8-3.9L3 9l4.2-2.1L9 3z" />
          <path d="M19 12l1.1 2.4L23 16l-2.9 1.6L19 20l-1.1-2.4L15 16l2.9-1.6L19 12z" />
        </Icon>
      );

      const Clock = (props) => (
  <Icon {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {/* Círculo do relógio */}
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    
    {/* Ponteiros (Meio-dia e quinze) */}
    <path d="M12 6v6l4 2" />
  </Icon>
);

      const MessageSquare = (props) => (
        <Icon {...props}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </Icon>
      );

      const BellRing = (props) => (
        <Icon {...props}>
          <path d="M10.3 18a1.7 1.7 0 0 0 3.4 0" />
          <path d="M4 14h16l-2-2V9a6 6 0 1 0-12 0v3l-2 2z" />
          <path d="M17 4a7 7 0 0 1 0 10" />
          <path d="M19.5 2.5a10 10 0 0 1 0 14" />
        </Icon>
      );

      const Search = (props) => (
        <Icon {...props}>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </Icon>
      );

      const X = (props) => (
        <Icon {...props}>
          <path d="M18 6 6 18" />
          <path d="M6 6l12 12" />
        </Icon>
      );

      const CalendarDays = (props) => (
        <Icon {...props}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4" />
          <path d="M8 3v4" />
          <path d="M3 10h18" />
        </Icon>
      );
      const User = (props) => (
        <Icon {...props}>
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </Icon>
      );

      const Mail = (props) => (
        <Icon {...props}>
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </Icon>
      );

      const Shield = (props) => (
        <Icon {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        </Icon>
      );

      const AtSign = (props) => (
        <Icon {...props}>
          <circle cx="12" cy="12" r="4" />
          <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
        </Icon>
      );
const MapPin = (props) => (
  <Icon {...props}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </Icon>
);
      const FileText = (props) => (
        <Icon {...props}>
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" x2="8" y1="13" y2="13" />
          <line x1="16" x2="8" y1="17" y2="17" />
          <line x1="10" x2="8" y1="9" y2="9" />
        </Icon>
      );

      const BookOpen = (props) => (
        <Icon {...props}>
          <path d="M2 5.5A3.5 3.5 0 0 1 5.5 2H21v18H5.5A3.5 3.5 0 0 0 2 23z" />
          <path d="M2 5.5A3.5 3.5 0 0 1 5.5 2H21" />
          <path d="M5.5 2v18" />
        </Icon>
      );

      const GraduationCap = (props) => (
        <Icon {...props}>
          <path d="M22 10 12 5 2 10l10 5 10-5z" />
          <path d="M6 12v4c0 1.8 2.7 4 6 4s6-2.2 6-4v-4" />
          <path d="M22 10v6" />
        </Icon>
      );

      const HeartHandshake = (props) => (
        <Icon {...props}>
          <path d="M20.8 12.2c1.1-1.2 1.1-3.1 0-4.3a3 3 0 0 0-4.2 0L15 9.5l1.6 1.6" />
          <path d="M3.2 12.2c-1.1-1.2-1.1-3.1 0-4.3a3 3 0 0 1 4.2 0L9 9.5 7.4 11.1" />
          <path d="M9 9.5 12 6l3 3.5" />
          <path d="M8 14c.9.9 2.1 1.5 4 1.5s3.1-.6 4-1.5" />
        </Icon>
      );

      const Globe2 = (props) => (
        <Icon {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3c2.5 2.7 4 5.7 4 9s-1.5 6.3-4 9c-2.5-2.7-4-5.7-4-9s1.5-6.3 4-9z" />
        </Icon>
      );

      const Users = (props) => (
        <Icon {...props}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a3.5 3.5 0 0 0-2.8-3.4" />
          <path d="M16 3.3a4 4 0 0 1 0 7.4" />
        </Icon>
      );

      const Megaphone = (props) => (
        <Icon {...props}>
          <path d="M3 11v2a2 2 0 0 0 2 2h2l4 4V5L7 9H5a2 2 0 0 0-2 2z" />
          <path d="M13 8a4 4 0 0 1 0 8" />
          <path d="M16 6a7 7 0 0 1 0 12" />
        </Icon>
      );

      const slugifyCategory = (value) =>
        String(value || "")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      function Dashboard() {
        const sectionHashMap = {
          calendar: "#calendario",
          feed: "#feed",
          filtros: "#filtros",
          professor: "#publicar",
          secretaria: "#utilizadores",
          forums: "#forums",
        };
        const categoryHashMap = Object.keys(categoryConfig).reduce(
          (acc, category) => {
            acc[category] = `#categoria-${slugifyCategory(category)}`;
            return acc;
          },
          {},
        );

        const [session, setSession] = useState(() => {
          return null;
        });
        const [profile, setProfile] = useState(null);
        const [authReady, setAuthReady] = useState(false);
        const [authLoading, setAuthLoading] = useState(true);
        const [themeMode, setThemeMode] = useState(() => {
          try {
            return localStorage.getItem("uniip-theme") || "light";
          } catch {
            return "light";
          }
        });
        const [publishError, setPublishError] = useState("");
        const [loginRole, setLoginRole] = useState("aluno");
        const [loginIdentifier, setLoginIdentifier] = useState(
          mockAccounts.aluno.username,
        );
        const [loginPassword, setLoginPassword] = useState(
          mockAccounts.aluno.password,
        );
        const [loginError, setLoginError] = useState("");
        const [authInfo, setAuthInfo] = useState("");
        const [announcementForm, setAnnouncementForm] = useState({
          title: "",
          description: "",
          school: "ESE",
          category: "Evento",
          expiresAt: "",
          startTime: "",
          endTime: "",
          maxRegistrations: "",
        });
        const [calendarMonth, setCalendarMonth] = useState(() => {
          const today = new Date();
          return new Date(today.getFullYear(), today.getMonth(), 1);
        });
        const [search, setSearch] = useState("");
        const [selectedSchool, setSelectedSchool] = useState("Todas");
        const [selectedCategory, setSelectedCategory] = useState(null);
        const [announcements, setAnnouncements] = useState([]);
        const [visibleAnnouncements, setVisibleAnnouncements] = useState([]);
        const [managedUsers, setManagedUsers] = useState([]);
        const [userManagementLoading, setUserManagementLoading] =
          useState(false);
        const [userManagementError, setUserManagementError] = useState("");
        const [userManagementInfo, setUserManagementInfo] = useState("");
        const [userForm, setUserForm] = useState({
          fullName: "",
          email: "",
          username: "",
          password: "",
          role: "Aluno",
          school: "ESCE",
        });
        const [profilePhoto, setProfilePhoto] = useState("");
        const [profilePhotoError, setProfilePhotoError] = useState("");
        const [registrationError, setRegistrationError] = useState("");
        const [registrationInfo, setRegistrationInfo] = useState("");
        const [registrationActionId, setRegistrationActionId] = useState("");
        const [scheduleConflict, setScheduleConflict] = useState(null);
        const [pendingRegistration, setPendingRegistration] = useState(null);
        const [weeklySchedule, setWeeklySchedule] = useState([]);
        const [weeklyAnnouncements, setWeeklyAnnouncements] = useState([]);
        const [expandedRegistration, setExpandedRegistration] = useState(null);
        const [announcementRegistrations, setAnnouncementRegistrations] = useState({});
        const [activeSection, setActiveSection] = useState("feed");
        const [currentView, setCurrentView] = useState("dashboard");
        const [exitingCategories, setExitingCategories] = useState([]);
        const [displayedCategories, setDisplayedCategories] = useState([]);
        const prevCategoriesRef = useRef([]);
        const announcementsRequestRef = useRef(0);

        const isDark = themeMode === "dark";
        const currentAccount = profile || session;
        const supabaseReady = Boolean(supabaseClient);
        const isSecretaria = currentAccount?.role === "Secretaria";
        const isAluno = currentAccount?.role === "Aluno";
        const isProfessor = currentAccount?.role === "Professor";

        const [selectedForum, setSelectedForum] = useState(null);
        const [forumMessages, setForumMessages] = useState([]);
        const [newMessage, setNewMessage] = useState("");
        const [onlineUsers, setOnlineUsers] = useState([]);
        const [allForumUsers, setAllForumUsers] = useState([]);
        const forumMessagesEndRef = useRef(null);
        const presenceChannelRef = useRef(null);

        const professorAnnouncements = useMemo(() => {
          if (!isProfessor || !session) return [];
          return announcements.filter((a) => a.author_id === session.id);
        }, [announcements, isProfessor, session]);

        const loadAnnouncements = async () => {
          if (!supabaseClient) return [];
          try {
            const query = supabaseClient
              .from("announcements")
              .select(
                "id, title, description, school, category, created_at, expires_at, start_time, end_time, max_registrations, author_id",
              )
              .order("created_at", { ascending: false });

            const { data, error } = await query;

            if (error) {
              throw error;
            }

            let registrationRows = [];
            const { data: registrationsData, error: registrationsError } =
              await supabaseClient
                .from("announcement_registrations")
                .select("announcement_id, student_id");

            if (!registrationsError) {
              registrationRows = registrationsData || [];
            }

            const countsByAnnouncementId = registrationRows.reduce(
              (acc, item) => {
                acc[item.announcement_id] = (acc[item.announcement_id] || 0) + 1;
                return acc;
              },
              {},
            );

            const myRegistrationIds = new Set(
              registrationRows
                .filter((item) => item.student_id === session?.id)
                .map((item) => item.announcement_id),
            );

            return (data || []).map((announcement) => ({
              ...announcement,
              registrations_count: countsByAnnouncementId[announcement.id] || 0,
              user_registered: myRegistrationIds.has(announcement.id),
            }));
          } catch (err) {
            console.error("Load announcements error:", err);
            return [];
          }
        };

        const refreshAnnouncements = async () => {
          const requestId = ++announcementsRequestRef.current;
          const data = await loadAnnouncements();
          if (requestId !== announcementsRequestRef.current) {
            return;
          }
          setAnnouncements(data);
        };

        const loadWeeklyScheduleAndAnnouncements = async () => {
          if (!supabaseClient || !isAluno) return;

          try {
            // Carregar horários de aulas
            const { data: scheduleData, error: scheduleError } = await supabaseClient
              .from("student_class_schedules")
              .select("*")
              .eq("student_id", supabaseClient.auth.user?.id || profile?.id)
              .order("day_of_week")
              .order("start_time");

            if (!scheduleError && scheduleData) {
              setWeeklySchedule(scheduleData || []);
            }

            // Carregar anúncios da semana
            const today = new Date();
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 7);

            const { data: announcementData, error: announcementError } = await supabaseClient
              .from("announcements")
              .select("*")
              .eq("school", currentAccount?.school || profile?.school)
              .gte("expires_at", toDateKey(weekStart))
              .lte("expires_at", toDateKey(weekEnd))
              .order("expires_at");

            if (!announcementError && announcementData) {
              setWeeklyAnnouncements(announcementData || []);
            }
          } catch (err) {
            console.error("Load weekly data error:", err);
          }
        };

        const loadProfessorRegistrations = async (profAnnouncements) => {
          if (!supabaseClient || !profAnnouncements.length) return;

          try {
            const registrationsMap = {};
            for (const announcement of profAnnouncements) {
              const { data: regData, error: regError } = await supabaseClient
                .rpc("get_announcement_registrations", {
                  p_announcement_id: announcement.id,
                });

              console.log("Registration RPC result for", announcement.id, ":", regData, regError);

              if (!regError && regData) {
                registrationsMap[announcement.id] = regData.map((r) => ({
                  student_id: r.student_id,
                  full_name: r.full_name || "Estudante",
                  username: r.username || "",
                  registered_at: r.registered_at,
                }));
              } else if (regError) {
                console.error("RPC error for", announcement.id, ":", regError);
              }
            }
            console.log("All registrations loaded:", registrationsMap);
            setAnnouncementRegistrations(registrationsMap);
          } catch (err) {
            console.error("Load professor registrations error:", err);
          }
        };

        const loadProfile = async (user) => {
          if (!supabaseClient || !user) return null;

          try {
            const PROFILE_TIMEOUT = 4500;
            const timeoutMarker = Symbol("profile-timeout");
            const timeoutPromise = new Promise((resolve) =>
              setTimeout(() => resolve(timeoutMarker), PROFILE_TIMEOUT),
            );

            const profileRequest = supabaseClient
              .from("profiles")
              .select("id, full_name, username, role, school, avatar_url")
              .eq("id", user.id)
              .single();

            const result = await Promise.race([profileRequest, timeoutPromise]);

            // Keep auth flow responsive by falling back to a basic session.
            if (result === timeoutMarker) {
              return null;
            }

            const { data, error } = result;

            if (error) {
              // Missing profile rows are expected in some test scenarios.
              return null;
            }

            return data;
          } catch (err) {
            return null;
          }
        };

        const loadManagedUsers = async () => {
          if (!supabaseClient || !isSecretaria) {
            setManagedUsers([]);
            return;
          }

          setUserManagementLoading(true);
          setUserManagementError("");

          try {
            const { data, error } = await supabaseClient.rpc(
              "secretaria_list_users",
            );

            if (error) {
              throw error;
            }

            setManagedUsers(data || []);
          } catch (error) {
            setUserManagementError(
              error.message || "Não foi possível carregar os utilizadores.",
            );
          } finally {
            setUserManagementLoading(false);
          }
        };

        useEffect(() => {
          if (!supabaseClient) {
            setAuthReady(true);
            setAuthLoading(false);
            setLoginError("Falta configurar a publishable key do Supabase.");
            return undefined;
          }

          let active = true;

          const bootstrap = async () => {
            try {
              const { data, error } = await supabaseClient.auth.getSession();

              if (!active) {
                return;
              }

              if (error) {
                console.error("getSession error:", error.message);
                setLoginError(error.message);
                setAuthReady(true);
                setAuthLoading(false);
                return;
              }

              const nextUser = data.session?.user || null;

              if (!nextUser) {
                setSession(null);
                setProfile(null);
                setAuthReady(true);
                setAuthLoading(false);
                return;
              }

              try {
                const nextProfile = await loadProfile(nextUser);
                if (!active) {
                  return;
                }

                setProfile(nextProfile);
                setSession({
                  id: nextUser.id,
                  email: nextUser.email,
                  role: nextProfile?.role || "Aluno",
                  name: nextProfile?.full_name || nextUser.email,
                  username:
                    nextProfile?.username ||
                    splitLoginIdentifier(nextUser.email),
                  school: nextProfile?.school || "",
                  avatar_url: nextProfile?.avatar_url || "",
                });
              } catch (profileError) {
                if (!active) {
                  return;
                }

                console.error(
                  "Bootstrap profile error:",
                  profileError.message || profileError,
                );
                // Fallback: still allow login with basic info from auth
                setSession({
                  id: nextUser.id,
                  email: nextUser.email,
                  role: "Aluno",
                  name: nextUser.email,
                  username: splitLoginIdentifier(nextUser.email),
                  school: "",
                  avatar_url: "",
                });
                setProfile(null);
                setLoginError(""); // Don't show error, silently use fallback
              } finally {
                if (active) {
                  setAuthReady(true);
                  setAuthLoading(false);
                }
              }
            } catch (err) {
              console.error("Bootstrap error:", err);
              if (active) {
                setAuthReady(true);
                setAuthLoading(false);
                setLoginError("Erro ao carregar sessão.");
              }
            }
          };

          bootstrap();

          const {
            data: { subscription },
          } = supabaseClient.auth.onAuthStateChange(
            async (_event, nextSession) => {
              if (!active) {
                return;
              }

              try {
                if (!nextSession?.user) {
                  setSession(null);
                  setProfile(null);
                  setAuthReady(true);
                  setAuthLoading(false);
                  return;
                }

                try {
                  const nextProfile = await loadProfile(nextSession.user);
                  if (!active) {
                    return;
                  }

                  setProfile(nextProfile);
                  setSession({
                    id: nextSession.user.id,
                    email: nextSession.user.email,
                    role: nextProfile?.role || "Aluno",
                    name: nextProfile?.full_name || nextSession.user.email,
                    username:
                      nextProfile?.username ||
                      splitLoginIdentifier(nextSession.user.email),
                    school: nextProfile?.school || "",
                    avatar_url: nextProfile?.avatar_url || "",
                  });
                } catch (profileError) {
                  if (!active) {
                    return;
                  }

                  console.error(
                    "Auth state profile error:",
                    profileError.message || profileError,
                  );
                  // Fallback: allow login with basic info
                  setSession({
                    id: nextSession.user.id,
                    email: nextSession.user.email,
                    role: "Aluno",
                    name: nextSession.user.email,
                    username: splitLoginIdentifier(nextSession.user.email),
                    school: "",
                    avatar_url: "",
                  });
                  setProfile(null);
                }
              } finally {
                if (active) {
                  setAuthReady(true);
                  setAuthLoading(false);
                }
              }
            },
          );

          return () => {
            active = false;
            subscription.unsubscribe();
          };
        }, []);

        useEffect(() => {
          if (supabaseClient && currentView === "dashboard" && session) {
            refreshAnnouncements();

            // Sintaxe correta do Supabase V2
            const subscription = supabaseClient
              .channel("mudancas-avisos")
              .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "announcements" },
                (payload) => {
                  refreshAnnouncements();
                },
              )
              .on(
                "postgres_changes",
                {
                  event: "*",
                  schema: "public",
                  table: "announcement_registrations",
                },
                () => {
                  refreshAnnouncements();
                },
              )
              .subscribe();

            return () => {
              announcementsRequestRef.current += 1;
              supabaseClient.removeChannel(subscription);
            };
          }
        }, [supabaseClient, currentView, session]);

        useEffect(() => {
          if (isProfessor && professorAnnouncements.length > 0) {
            loadProfessorRegistrations(professorAnnouncements);
          }
        }, [professorAnnouncements, isProfessor]);

        useEffect(() => {
          try {
            localStorage.setItem("uniip-theme", themeMode);
          } catch {
            // Ignore storage failures.
          }

          document.documentElement.classList.toggle("theme-dark", isDark);
          document.documentElement.classList.toggle("dark", isDark);
          document.documentElement.style.colorScheme = isDark
            ? "dark"
            : "light";
        }, [themeMode, isDark]);

        useEffect(() => {
          const defaultAccount = mockAccounts[loginRole];
          setLoginIdentifier(defaultAccount.username);
          setLoginPassword(defaultAccount.password);
          setLoginError("");
          setAuthInfo("");
        }, [loginRole]);

        useEffect(() => {
          if (isSecretaria) {
            loadManagedUsers();
            return;
          }

          setManagedUsers([]);
          setUserManagementError("");
          setUserManagementInfo("");
        }, [isSecretaria, session?.id]);

        useEffect(() => {
          if (!currentAccount) {
            return;
          }

          const defaultSchool =
            currentAccount.role === "Professor"
              ? currentAccount.school || "ESCE"
              : currentAccount.school || "Todas";
          setSelectedSchool(defaultSchool);
        }, [currentAccount?.role, currentAccount?.school]);

        useEffect(() => {
          setProfilePhoto(currentAccount?.avatar_url || "");
          setProfilePhotoError("");
        }, [currentAccount?.id, currentAccount?.avatar_url]);

        useEffect(() => {
          if (!currentAccount) {
            return;
          }

          if (currentView !== "dashboard") {
            return;
          }

          const sectionIds =
            currentAccount.role === "Professor"
              ? ["calendar", "feed", "filtros", "professor"]
              : currentAccount.role === "Secretaria"
                ? ["calendar", "feed", "filtros", "secretaria"]
              : ["calendar", "feed", "filtros"];

          const sections = sectionIds
            .map((id) => document.getElementById(id))
            .filter(Boolean);

          if (sections.length === 0) {
            return;
          }

          const observer = new IntersectionObserver(
            (entries) => {
              const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

              if (visible[0]?.target?.id) {
                setActiveSection(visible[0].target.id);
              }
            },
            {
              rootMargin: "-140px 0px -50% 0px",
              threshold: [0.25, 0.5, 0.75],
            },
          );

          sections.forEach((section) => observer.observe(section));

          return () => observer.disconnect();
        }, [currentAccount?.role, currentView]);

        useEffect(() => {
          const syncViewFromHash = () => {
            const hash = window.location.hash.toLowerCase();

            if (hash === "#conta") {
              setCurrentView("account");
              setActiveSection("account");
              return;
            }

          const categoryFromHash = Object.keys(categoryHashMap).find(
              (category) => categoryHashMap[category] === hash,
            );
if (categoryFromHash) {
              setSelectedCategory(categoryFromHash);
              setCurrentView("category");
              setActiveSection("feed");
              return;
            }

            let nextSection = "feed";
            if (hash === "#filtros") {
              nextSection = "filtros";
            } else if (hash === "#calendario") {
              setCurrentView("calendar");
              setActiveSection("calendar");
              return;
            } else if (hash === "#publicar" && session?.role === "Professor") {
              nextSection = "professor";
            } else if (
              hash === "#utilizadores" &&
              session?.role === "Secretaria"
            ) {
              nextSection = "secretaria";
            } else if (hash === "#foruns") {
              setCurrentView("forums");
              setActiveSection("forums");
              return;
            }

            setCurrentView("dashboard");
            setActiveSection(nextSection);
          };

          syncViewFromHash();
          window.addEventListener("hashchange", syncViewFromHash);

          return () =>
            window.removeEventListener("hashchange", syncViewFromHash);
        }, [currentAccount?.role]);

        const navigateToSection = (sectionId) => {
          const nextHash = sectionHashMap[sectionId] || "#feed";

          if (sectionId === "calendar") {
            navigateToCalendarPage();
            return;
          }

          if (currentView !== "dashboard") {
            setCurrentView("dashboard");
            window.location.hash = nextHash;
            setActiveSection(sectionId);
            return;
          }

          const target = document.getElementById(sectionId);

          if (!target) {
            return;
          }

          window.location.hash = nextHash;
          setActiveSection(sectionId);
        };

        const navigateToAccountPage = () => {
          setCurrentView("account");
          setActiveSection("account");
          window.location.hash = "#conta";
        };

        const navigateToCalendarPage = () => {
          setCurrentView("calendar");
          setActiveSection("calendar");
          window.location.hash = "#calendario";
        };

        const navigateToCategoryPage = (category) => {
          if (!categoryConfig[category]) {
            return;
          }

          setSelectedCategory(category);
          setSearch("");
          setCurrentView("category");
          setActiveSection("feed");
          window.location.hash = categoryHashMap[category] || "#feed";
        };

        const navigateToForumsPage = () => {
          window.location.hash = "#foruns";
        };

        const handleLogin = async (event) => {
          event.preventDefault();

          if (!supabaseClient) {
            setLoginError("Falta configurar a publishable key do Supabase.");
            return;
          }

          const identifier = loginIdentifier.trim().toLowerCase();
          const password = loginPassword;

          if (!identifier || !password) {
            setLoginError("Preenche o email ou username e a password.");
            return;
          }

          setLoginError("");
          setAuthInfo("A autenticar...");

          try {
            let emailToUse = identifier;

            if (!identifier.includes("@")) {
              const { data, error } = await supabaseClient.rpc(
                "resolve_login_email",
                {
                  login_identifier: identifier,
                },
              );

              if (error || !data) {
                throw new Error("Credenciais inválidas.");
              }

              emailToUse = data;
            }

            const { error } = await supabaseClient.auth.signInWithPassword({
              email: emailToUse,
              password,
            });

            if (error) {
              throw error;
            }

            setAuthInfo("Sessão iniciada com sucesso.");
            setCurrentView("dashboard");
            setActiveSection("feed");
            window.location.hash = "#feed";
          } catch (error) {
            setAuthInfo("");
            setLoginError(error.message || "Não foi possível iniciar sessão.");
          }
        };

        const handleLogout = async () => {
          if (supabaseClient) {
            await supabaseClient.auth.signOut();
          }

          setSession(null);
          setProfile(null);
          setAnnouncements([]);
          setVisibleAnnouncements([]);
          setCurrentView("dashboard");
          setActiveSection("feed");
          window.location.hash = "";
        };

        const toggleTheme = () => {
          setThemeMode((current) => (current === "dark" ? "light" : "dark"));
        };

        const handleProfilePhotoChange = async (event) => {
          const file = event.target.files?.[0];

          if (!file) {
            return;
          }

          if (!file.type.startsWith("image/")) {
            setProfilePhotoError("Seleciona um ficheiro de imagem válido.");
            event.target.value = "";
            return;
          }

          const maxSizeInBytes = 2 * 1024 * 1024;
          if (file.size > maxSizeInBytes) {
            setProfilePhotoError("A imagem deve ter no máximo 2MB.");
            event.target.value = "";
            return;
          }

          const userId = currentAccount?.id;
          if (!userId) {
            setProfilePhotoError("Sessão inválida para guardar a foto.");
            event.target.value = "";
            return;
          }

          if (!supabaseClient) {
            setProfilePhotoError("Supabase não está configurado.");
            event.target.value = "";
            return;
          }

          const avatarPath = `${userId}/avatar`;

          try {
            const { error: uploadError } = await supabaseClient.storage
              .from("avatars")
              .upload(avatarPath, file, {
                upsert: true,
                cacheControl: "3600",
                contentType: file.type,
              });

            if (uploadError) {
              throw uploadError;
            }

            const { data: publicData } = supabaseClient.storage
              .from("avatars")
              .getPublicUrl(avatarPath);

            const publicUrl = publicData?.publicUrl
              ? `${publicData.publicUrl}?t=${Date.now()}`
              : "";

            if (!publicUrl) {
              throw new Error("Não foi possível obter o URL da imagem.");
            }

            const { error: profileError } = await supabaseClient
              .from("profiles")
              .update({ avatar_url: publicUrl })
              .eq("id", userId);

            if (profileError) {
              throw profileError;
            }

            setProfilePhoto(publicUrl);
            setProfilePhotoError("");
            setProfile((current) =>
              current ? { ...current, avatar_url: publicUrl } : current,
            );
            setSession((current) =>
              current && current.id === userId
                ? { ...current, avatar_url: publicUrl }
                : current,
            );
          } catch (error) {
            setProfilePhotoError(
              error.message || "Não foi possível atualizar a foto de perfil.",
            );
          } finally {
            event.target.value = "";
          }
        };

        const handleRemoveProfilePhoto = () => {
          const userId = currentAccount?.id;

          if (!userId || !supabaseClient) {
            return;
          }

          const avatarPath = `${userId}/avatar`;

          const clearAvatar = async () => {
            try {
              await supabaseClient.storage.from("avatars").remove([avatarPath]);

              const { error: profileError } = await supabaseClient
                .from("profiles")
                .update({ avatar_url: null })
                .eq("id", userId);

              if (profileError) {
                throw profileError;
              }

              setProfilePhoto("");
              setProfilePhotoError("");
              setProfile((current) =>
                current ? { ...current, avatar_url: "" } : current,
              );
              setSession((current) =>
                current && current.id === userId
                  ? { ...current, avatar_url: "" }
                  : current,
              );
            } catch (error) {
              setProfilePhotoError(
                error.message || "Não foi possível remover a foto de perfil.",
              );
            }
          };

          clearAvatar();
        };

        const handleCreateAnnouncement = async (event) => {
          event.preventDefault();

          if (!session || session.role !== "Professor") {
            setPublishError("Apenas professores podem publicar.");
            return;
          }

          if (
            !announcementForm.title.trim() ||
            !announcementForm.description.trim() ||
            !announcementForm.expiresAt
          ) {
            setPublishError("Preenche todos os campos obrigatórios.");
            return;
          }

          if (announcementForm.startTime || announcementForm.endTime) {
            if (!announcementForm.startTime || !announcementForm.endTime) {
              setPublishError("Indica a hora de início e de fim.");
              return;
            }

            if (announcementForm.endTime <= announcementForm.startTime) {
              setPublishError("A hora de fim tem de ser depois da hora de início.");
              return;
            }
          }

          const maxRegistrationsValue = announcementForm.maxRegistrations.trim();
          const parsedMaxRegistrations =
            maxRegistrationsValue === ""
              ? null
              : Number.parseInt(maxRegistrationsValue, 10);

          if (
            maxRegistrationsValue !== "" &&
            (!Number.isInteger(parsedMaxRegistrations) || parsedMaxRegistrations <= 0)
          ) {
            setPublishError("O limite máximo deve ser um número inteiro maior que 0.");
            return;
          }

          try {
            const { error } = await supabaseClient
              .from("announcements")
              .insert({
                title: announcementForm.title.trim(),
                description: announcementForm.description.trim(),
                school: announcementForm.school,
                category: announcementForm.category,
                expires_at: announcementForm.expiresAt,
                start_time: announcementForm.startTime || null,
                end_time: announcementForm.endTime || null,
                max_registrations: parsedMaxRegistrations,
                author_id: session.id,
              });

            if (error) throw error;

            setAnnouncementForm({
              title: "",
              description: "",
              school: announcementForm.school,
              category: announcementForm.category,
              expiresAt: "",
              startTime: "",
              endTime: "",
              maxRegistrations: "",
            });
            setPublishError("");
          } catch (err) {
            setPublishError(err.message || "Erro ao publicar aviso.");
          }
        };

        const handleDeleteAnnouncement = async (announcementId) => {
          if (!session || session.role !== "Professor") {
            setPublishError("Apenas professores podem remover avisos.");
            return;
          }

          try {
            const { error } = await supabaseClient.rpc("delete_announcement", {
              p_announcement_id: announcementId,
            });

            if (error) throw error;

            setPublishError("Aviso removido com sucesso.");
            setTimeout(() => setPublishError(""), 3000);
            await refreshAnnouncements();
          } catch (err) {
            setPublishError(err.message || "Erro ao remover aviso.");
            setTimeout(() => setPublishError(""), 3000);
          }
        };

        const handleToggleRegistration = async (announcement) => {
          if (!isAluno || !supabaseClient) {
            setRegistrationError("Apenas alunos podem gerir inscrições.");
            return;
          }

          if (!announcement?.id) {
            return;
          }

          const isRegistered = Boolean(announcement.user_registered);

          if (
            !isRegistered &&
            announcement.max_registrations != null &&
            announcement.registrations_count >= announcement.max_registrations
          ) {
            setRegistrationError("Este aviso já atingiu o limite máximo de inscrições.");
            return;
          }

          // If unregistering, proceed without conflict check
          if (isRegistered) {
            setRegistrationError("");
            setRegistrationInfo("");
            setRegistrationActionId(announcement.id);

            try {
              const { error } = await supabaseClient.rpc("unregister_announcement", {
                p_announcement_id: announcement.id,
              });

              if (error) {
                throw error;
              }

              setRegistrationInfo("Inscrição removida com sucesso.");
              await refreshAnnouncements();
              setTimeout(() => setRegistrationInfo(""), 3000);
            } catch (error) {
              setRegistrationError(
                error.message || "Não foi possível atualizar a inscrição.",
              );
              setTimeout(() => setRegistrationError(""), 3000);
            } finally {
              setRegistrationActionId("");
            }
            return;
          }

          // Check for schedule conflicts before registering
          setRegistrationError("");
          setRegistrationInfo("");

          if (announcement.start_time && announcement.end_time) {
            try {
              const { data: conflictData, error: conflictError } = await supabaseClient.rpc(
                "check_announcement_conflict",
                { p_announcement_id: announcement.id }
              );

              if (conflictError) {
                setRegistrationError("Erro ao verificar horário: " + conflictError.message);
                return;
              }

              if (conflictData && conflictData[0]?.has_conflict) {
                // Show conflict warning
                setScheduleConflict({
                  conflictingClasses: conflictData[0]?.conflicting_classes,
                  announcement: announcement,
                });
                return;
              }
            } catch (error) {
              setRegistrationError("Erro ao verificar conflito de horário.");
              return;
            }
          }

          // No conflicts, proceed with registration
          setRegistrationActionId(announcement.id);

          try {
            const { error } = await supabaseClient.rpc("register_announcement", {
              p_announcement_id: announcement.id,
              p_force: false,
            });

            if (error) {
              throw error;
            }

            setRegistrationInfo("Inscrição realizada com sucesso.");
            await refreshAnnouncements();
            setTimeout(() => setRegistrationInfo(""), 3000);
          } catch (error) {
            setRegistrationError(
              error.message || "Não foi possível atualizar a inscrição.",
            );
            setTimeout(() => setRegistrationError(""), 3000);
          } finally {
            setRegistrationActionId("");
          }
        };

        const handleConfirmRegistrationWithConflict = async () => {
          if (!scheduleConflict?.announcement || !supabaseClient) {
            setScheduleConflict(null);
            return;
          }

          setRegistrationActionId(scheduleConflict.announcement.id);
          setRegistrationError("");
          setRegistrationInfo("");

          try {
            const { error } = await supabaseClient.rpc("register_announcement", {
              p_announcement_id: scheduleConflict.announcement.id,
              p_force: true,
            });

            if (error) {
              throw error;
            }

            setRegistrationInfo("Inscrição realizada com sucesso (com aviso de conflito).");
            setScheduleConflict(null);
            await refreshAnnouncements();
            setTimeout(() => setRegistrationInfo(""), 3000);
          } catch (error) {
            setRegistrationError(
              error.message || "Não foi possível atualizar a inscrição.",
            );
            setTimeout(() => setRegistrationError(""), 3000);
          } finally {
            setRegistrationActionId("");
          }
        };

        const handleCancelConflictDialog = () => {
          setScheduleConflict(null);
          setRegistrationError("");
        };

        const handleCreateUser = async (event) => {
          event.preventDefault();

          if (!isSecretaria || !supabaseClient) {
            setUserManagementError(
              "Apenas a secretaria pode adicionar utilizadores.",
            );
            return;
          }

          if (
            !userForm.fullName.trim() ||
            !userForm.email.trim() ||
            !userForm.username.trim() ||
            !userForm.password
          ) {
            setUserManagementError("Preenche todos os campos obrigatórios.");
            return;
          }

          setUserManagementError("");
          setUserManagementInfo("A criar utilizador...");

          try {
            const { error } = await supabaseClient.rpc("secretaria_create_user", {
              p_full_name: userForm.fullName.trim(),
              p_email: userForm.email.trim().toLowerCase(),
              p_username: userForm.username.trim().toLowerCase(),
              p_password: userForm.password,
              p_role: userForm.role,
              p_school: userForm.school,
            });

            if (error) {
              throw error;
            }

            setUserManagementInfo("Utilizador criado com sucesso.");
            setUserForm((current) => ({
              ...current,
              fullName: "",
              email: "",
              username: "",
              password: "",
              role: "Aluno",
            }));
            await loadManagedUsers();
          } catch (error) {
            setUserManagementInfo("");
            setUserManagementError(
              error.message || "Não foi possível criar o utilizador.",
            );
          }
        };

        const handleDeleteUser = async (targetUserId) => {
          if (!isSecretaria || !supabaseClient || !targetUserId) {
            return;
          }

          setUserManagementError("");
          setUserManagementInfo("A remover utilizador...");

          try {
            const { error } = await supabaseClient.rpc("secretaria_delete_user", {
              target_user_id: targetUserId,
            });

            if (error) {
              throw error;
            }

            setUserManagementInfo("Utilizador removido com sucesso.");
            await loadManagedUsers();
          } catch (error) {
            setUserManagementInfo("");
            setUserManagementError(
              error.message || "Não foi possível remover o utilizador.",
            );
          }
        };

        useEffect(() => {
          const filtered = announcements
            .filter((announcement) => {
              const matchesSearch =
                announcement.title
                  .toLowerCase()
                  .includes(search.toLowerCase()) ||
                announcement.description
                  .toLowerCase()
                  .includes(search.toLowerCase());
              const matchesSchool =
                selectedSchool === "Todas" ||
                announcement.school === selectedSchool;
const matchesCategory =
                 selectedCategory === null || announcement.category === selectedCategory;
              return matchesSearch && matchesSchool && matchesCategory;
            })
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

          setVisibleAnnouncements(filtered);
        }, [search, selectedSchool, selectedCategory, announcements]);

        // Carregar calendário e anúncios da semana ao ir para página de conta
        useEffect(() => {
          if (currentView === "account" && isAluno) {
            loadWeeklyScheduleAndAnnouncements();
          }
        }, [currentView, isAluno]);

        const loadForumMessages = async (eventId) => {
          if (!supabaseClient) return;
          try {
            const { data, error } = await supabaseClient
              .from("event_messages")
              .select("*")
              .eq("event_id", eventId)
              .order("created_at", { ascending: true });

            if (error) throw error;
            setForumMessages(data || []);
          } catch (err) {
            console.error("Load forum messages error:", err);
            setForumMessages([]);
          }
        };

        const loadForumUsers = async (eventId) => {
          if (!supabaseClient) return;
          try {
            // Get registered students
            const { data: registrations, error: regError } = await supabaseClient
              .from("announcement_registrations")
              .select("student_id")
              .eq("announcement_id", eventId);

            if (regError) throw regError;

            // Get author info
            const { data: announcement, error: annError } = await supabaseClient
              .from("announcements")
              .select("author_id")
              .eq("id", eventId)
              .single();

            if (annError) throw annError;

            // Get all user names from profiles or auth
            const userIds = [...(registrations?.map(r => r.student_id) || []), announcement?.author_id].filter(Boolean);

            if (userIds.length > 0) {
              const { data: profiles, error: profError } = await supabaseClient
                .from("profiles")
                .select("id, username, full_name")
                .in("id", userIds);

              if (!profError && profiles) {
                setAllForumUsers(
                  profiles.map((profile) => ({
                    id: profile.id,
                    username: profile.username || profile.full_name || "Utilizador",
                  })),
                );
              }
            }
          } catch (err) {
            console.error("Load forum users error:", err);
          }
        };

        const sendForumMessage = async () => {
          if (!selectedForum || !session || !newMessage.trim()) return;
          try {
            const { error } = await supabaseClient
              .from("event_messages")
              .insert({
                event_id: selectedForum.id,
                user_id: session.id,
                user_name: currentAccount?.name || session.email,
                content: newMessage.trim(),
              });
            if (error) throw error;
            setNewMessage("");
          } catch (err) {
            console.error("Send message error:", err);
          }
        };

        const deleteForumMessage = async (messageId) => {
          if (!session) return;

          // Optimistic update: remove immediately from local state
          setForumMessages((current) => current.filter(msg => msg.id !== messageId));

          try {
            let query = supabaseClient
              .from("event_messages")
              .delete()
              .eq("id", messageId);

            // Only filter by user_id if not the professor (announcement author)
            const isProfessor = selectedForum?.author_id === session.id;
            if (!isProfessor) {
              query = query.eq("user_id", session.id);
            }

            const { error } = await query;
            if (error) throw error;
          } catch (err) {
            console.error("Delete message error:", err);
            // If error, reload messages to revert
            if (selectedForum) {
              loadForumMessages(selectedForum.id);
            }
          }
        };

        useEffect(() => {
          if (currentView === "forums" && selectedForum) {
            loadForumMessages(selectedForum.id);
            loadForumUsers(selectedForum.id);

            // Track online users with presence
            const presenceChannel = supabaseClient
              .channel(`forum-presence-${selectedForum.id}`)
              .on('presence', { event: 'sync' }, () => {
                const state = presenceChannel.presenceState();
                const users = Object.values(state)
                  .flat()
                  .map((presence) => presence.user_id)
                  .filter(Boolean);
                setOnlineUsers([...new Set(users)]); // Remove duplicates
              })
              .on('presence', { event: 'join' }, ({ key, newPresences }) => {
                const users = Object.values(presenceChannel.presenceState())
                  .flat()
                  .map((presence) => presence.user_id)
                  .filter(Boolean);
                setOnlineUsers([...new Set(users)]);
              })
              .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
                const users = Object.values(presenceChannel.presenceState())
                  .flat()
                  .map((presence) => presence.user_id)
                  .filter(Boolean);
                setOnlineUsers([...new Set(users)]);
              })
              .subscribe(async (status) => {
                if (status === 'SUBSCRIBED' && session) {
                  await presenceChannel.track({
                    user_id: session.id,
                    user_name: currentAccount?.username || session.email
                  });
                }
              });

            presenceChannelRef.current = presenceChannel;

            // Listen for new messages
            const messageChannel = supabaseClient
              .channel(`forum-messages-${selectedForum.id}`)
              .on(
                "postgres_changes",
                {
                  event: "*",
                  schema: "public",
                  table: "event_messages",
                  filter: `event_id=eq.${selectedForum.id}`,
                },
                (payload) => {
                  if (payload.eventType === "INSERT") {
                    setForumMessages((current) => [...current, payload.new]);
                  } else if (payload.eventType === "DELETE") {
                    setForumMessages((current) => current.filter(msg => msg.id !== payload.old.id));
                  }
                },
              )
              .subscribe();

            return () => {
              supabaseClient.removeChannel(presenceChannel);
              supabaseClient.removeChannel(messageChannel);
              setOnlineUsers([]);
              setAllForumUsers([]);
            };
          } else {
            setForumMessages([]);
            setOnlineUsers([]);
          }
        }, [currentView, selectedForum, supabaseClient, session, currentAccount]);

        // Removed auto-scroll when messages load

        const counts = useMemo(() => {
          const bySchool = announcements.reduce((acc, item) => {
            acc[item.school] = (acc[item.school] || 0) + 1;
            return acc;
          }, {});

          const byCategory = announcements.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1;
            return acc;
          }, {});

          return {
            total: announcements.length,
            bySchool,
            byCategory,
          };
        }, [announcements]);

        const categoriesBySchool = useMemo(() => {
          const filtered = selectedSchool === "Todas"
            ? announcements
            : announcements.filter(a => a.school === selectedSchool);
          
          const categories = [...new Set(filtered.map(a => a.category))];
          return categories;
        }, [announcements, selectedSchool]);

        // Controlar animações de entrada e saída das categorias
        useEffect(() => {
          const previousCategories = prevCategoriesRef.current;
          const currentCategories = categoriesBySchool;

          const toExit = previousCategories.filter(
            (category) => !currentCategories.includes(category),
          );

          if (toExit.length === 0) {
            setDisplayedCategories(currentCategories);
            prevCategoriesRef.current = currentCategories;
            return;
          }

          setExitingCategories((previous) => [
            ...new Set([...previous, ...toExit]),
          ]);

          setDisplayedCategories((previousDisplayed) => {
            const nextDisplayed = [...previousDisplayed];

            currentCategories.forEach((category) => {
              if (!nextDisplayed.includes(category)) {
                nextDisplayed.push(category);
              }
            });

            toExit.forEach((category) => {
              if (!nextDisplayed.includes(category)) {
                nextDisplayed.push(category);
              }
            });

            return nextDisplayed;
          });

          const timer = setTimeout(() => {
            setExitingCategories((previous) =>
              previous.filter((category) => !toExit.includes(category)),
            );
            setDisplayedCategories(currentCategories);
          }, 320);

          prevCategoriesRef.current = currentCategories;
          return () => clearTimeout(timer);
        }, [categoriesBySchool]);

        const countsBySchoolAndCategory = useMemo(() => {
          const filtered = selectedSchool === "Todas"
            ? announcements
            : announcements.filter(a => a.school === selectedSchool);

          const byCategory = filtered.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1;
            return acc;
          }, {});

          return byCategory;
        }, [announcements, selectedSchool]);

        const myForums = useMemo(() => {
          if (!session) return [];
          return announcements.filter((a) => {
            const isRegistered = a.user_registered;
            const isAuthor = a.author_id === session.id;
            return isRegistered || isAuthor;
          });
        }, [announcements, session]);

        const calendarEvents = useMemo(() => {
          return announcements
            .filter(
              (announcement) =>
                announcement.category === "Evento",
            )
            .map((announcement) => {
              const dateString = announcement.expires_at || announcement.created_at;
              const dateKey = dateString.slice(0, 10);
              const [year, month, day] = dateKey.split("-").map(Number);
              const timeRange = formatEventTimeRange(
                announcement.start_time,
                announcement.end_time,
              );

              return {
                ...announcement,
                eventDate: new Date(year, month - 1, day),
                dateKey,
                timeRange,
              };
            })
            .sort((a, b) => a.eventDate - b.eventDate);
        }, [announcements]);

        const calendarDays = useMemo(() => {
          const year = calendarMonth.getFullYear();
          const month = calendarMonth.getMonth();
          const firstDay = new Date(year, month, 1);
          const leadingDays = (firstDay.getDay() + 6) % 7;
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          const days = [];

          for (let index = 0; index < leadingDays; index += 1) {
            days.push(null);
          }

          for (let day = 1; day <= daysInMonth; day += 1) {
            days.push(new Date(year, month, day));
          }

          while (days.length % 7 !== 0) {
            days.push(null);
          }

          return days;
        }, [calendarMonth]);

        const monthEvents = useMemo(() => {
          return calendarEvents.filter((event) => {
            const eventYear = event.eventDate.getFullYear();
            const eventMonth = event.eventDate.getMonth();
            return (
              eventYear === calendarMonth.getFullYear() &&
              eventMonth === calendarMonth.getMonth()
            );
          });
        }, [calendarEvents, calendarMonth]);

        const eventDays = useMemo(() => {
          return monthEvents.reduce((acc, event) => {
            const dayKey = event.dateKey;
            acc[dayKey] = acc[dayKey] ? [...acc[dayKey], event] : [event];
            return acc;
          }, {});
        }, [monthEvents]);

        const shiftCalendarMonth = (offset) => {
          setCalendarMonth((current) => {
            return new Date(
              current.getFullYear(),
              current.getMonth() + offset,
              1,
            );
          });
        };

        if (!authReady || authLoading) {
          return (
            <div
              className={
                isDark
                  ? "min-h-screen bg-[#252931] text-slate-100"
                  : "min-h-screen bg-[linear-gradient(180deg,#eef2f7_0%,#f7f9fc_45%,#eff3f8_100%)] text-ink-950"
              }
            >
              <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-8 lg:px-8">
                <div className="panel w-full max-w-md p-6 text-center shadow-glow">
                  <div
                    className={`mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full transition-all duration-300 ${
                      isDark
                        ? "bg-ink-800 ring-4 ring-ink-700 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                        : "bg-white ring-4 ring-slate-100 shadow-md"
                    }`}
                  >
                    <img
                      src="logo.png"
                      alt="Logo do Portal"
                      className="h-full w-full object-contain p-2"
                    />
                  </div>
                  <h1 className="display-title mt-4 text-3xl font-semibold text-ink-950">
                    A carregar sessão
                  </h1>
                  <p className="mt-2 text-sm text-ink-600">
                    A sincronizar autenticação e perfil com Supabase.
                  </p>
                </div>
              </div>
            </div>
          );
        }

        if (!currentAccount) {
          return (
            <div
              className={
                isDark
                  ? "min-h-screen bg-[#0f141c] text-slate-100"
                  : "min-h-screen bg-[linear-gradient(180deg,#eef2f7_0%,#f7f9fc_45%,#eff3f8_100%)] text-ink-950"
              }
            >
              <div className="mx-auto flex max-w-6xl justify-end px-4 pt-4 lg:px-8">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-slate-50"
                >
                  {isDark ? "Modo claro" : "Modo escuro"}
                </button>
              </div>
              <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-8 lg:px-8">
                <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                  <section className="panel p-8 shadow-glow lg:p-10">
                    <div
                      className={`mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full transition-all duration-300 ${
                        isDark
                          ? "bg-ink-800 ring-4 ring-ink-700 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                          : "bg-white ring-4 ring-slate-100 shadow-md"
                      }`}
                    >
                      <img
                        src="logo.png"
                        alt="Logo do Portal"
                        className="h-full w-full object-contain p-2"
                      />
                    </div>{" "}
                    <h1 className="display-title mt-5 max-w-2xl text-4xl font-semibold text-ink-950 md:text-[3.2rem] md:leading-[1.05]">
                      UNIIP{" "}
                    </h1>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-ink-700 md:text-lg">
                      Ambiente único para todos os eventos, oportunidades e informações relevantes para o IPS
                    </p>
                    <div className="mt-8 grid gap-3 md:grid-cols-2">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="text-sm text-slate-500">
                          Conta de teste do professor
                        </div>
                        <div className="mt-2 font-semibold text-ink-950">
                          professor@uniip.pt
                        </div>
                        <div className="text-sm text-ink-600">
                          Username: professor
                        </div>
                        <div className="text-sm text-ink-600">
                          Password: prof123
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="text-sm text-slate-500">
                          Conta de teste do aluno
                        </div>
                        <div className="mt-2 font-semibold text-ink-950">
                          aluno@uniip.pt
                        </div>
                        <div className="text-sm text-ink-600">
                          Username: armindo
                        </div>
                        <div className="text-sm text-ink-600">
                          Password: aluno123
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                        <div className="text-sm text-slate-500">
                          Conta de teste da secretaria
                        </div>
                        <div className="mt-2 font-semibold text-ink-950">
                          secretaria@uniip.pt
                        </div>
                        <div className="text-sm text-ink-600">
                          Username: secretaria
                        </div>
                        <div className="text-sm text-ink-600">
                          Password: secret123
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="panel p-6 shadow-glow lg:p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-semibold text-ink-950">
                          Autenticação
                        </h2>
                        <p className="mt-1 text-sm text-ink-600">
                          Selecione o perfil e introduza os dados de acesso.
                        </p>
                      </div>
                      <BellRing className="h-5 w-5 text-slate-500" />
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1">
                      {[
                        { key: "aluno", label: "Aluno" },
                        { key: "professor", label: "Professor" },
                        { key: "secretaria", label: "Secretaria" },
                      ].map((option) => (
                        <button
                          key={option.key}
                          onClick={() => setLoginRole(option.key)}
                          className={
                            "rounded-md px-4 py-3 text-sm font-semibold transition " +
                            (loginRole === option.key
                              ? "bg-white text-ink-950 ring-1 ring-slate-200"
                              : "text-slate-500 hover:text-ink-700")
                          }
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>

                    <form className="mt-6 space-y-4" onSubmit={handleLogin}>
                      <label className="block space-y-2">
                        <span className="text-sm font-medium text-ink-700">
                          Email ou username
                        </span>
                        <input
                          value={loginIdentifier}
                          onChange={(event) =>
                            setLoginIdentifier(event.target.value)
                          }
                          className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink-700 focus:bg-white"
                          placeholder="professor ou email@uniip.pt"
                        />
                      </label>

                      <label className="block space-y-2">
                        <span className="text-sm font-medium text-ink-700">
                          Password
                        </span>
                        <input
                          type="password"
                          value={loginPassword}
                          onChange={(event) =>
                            setLoginPassword(event.target.value)
                          }
                          className="w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-ink-700 focus:bg-white"
                          placeholder="A sua password"
                        />
                      </label>

                      {loginError ? (
                        <div className="rounded-md border border-coral-100 bg-coral-50 px-4 py-3 text-sm text-coral-500">
                          {loginError}
                        </div>
                      ) : null}

                      {authInfo ? (
                        <div className="rounded-md border border-accent-100 bg-accent-50 px-4 py-3 text-sm text-accent-600">
                          {authInfo}
                        </div>
                      ) : null}

                      <button
                        type="submit"
                        className="flex w-full items-center justify-center gap-2 rounded-md bg-ink-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink-800"
                      >
                        Entrar no portal
                      </button>
                    </form>
                  </section>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div
            className={
              isDark
                ? "min-h-screen bg-[#252931] text-slate-100"
                : "min-h-screen bg-[#f2f4f7] text-ink-950"
            }
          >
           <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl transition-all">
  <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
    
    {/* Lado Esquerdo: Identidade Visual Premium */}
    <div 
      className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-80"
      onClick={() => navigateToSection("feed")}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-ink-900 to-ink-950 shadow-md shadow-ink-900/10">
        <img src="logo.png" alt="UNIIP" className="h-5 w-5 object-contain brightness-0 invert" />
      </div>
      <div className="hidden flex-col sm:flex">
        <span className="text-base font-bold leading-tight tracking-tight text-ink-950">UNIIP</span>
        <span className="text-[10px] font-semibold uppercase leading-tight tracking-widest text-slate-500">Portal IPS</span>
      </div>
    </div>

    {/* Centro: Navegação Estilo "Pill" (Segmented Control) */}
   

    {/* Lado Direito: Ações Globais e Perfil */}
    <div className="flex items-center gap-3 sm:gap-4">
      
      {/* Grupo de Ações (Tema e Sair) */}
      <div className="flex items-center gap-1 rounded-full border border-slate-200/60 bg-slate-50/50 p-1">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-all hover:bg-white hover:text-ink-900 hover:shadow-sm"
          title="Alternar Tema"
        >
          {isDark ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-all hover:bg-red-100 hover:text-red-700 hover:shadow-sm dark:hover:bg-red-900/30 dark:hover:text-red-400"
          title="Terminar Sessão"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

      <div className="hidden h-6 w-px bg-slate-200/80 sm:block"></div>

      {/* Bloco de Perfil Clicável */}
      <button
        onClick={navigateToAccountPage}
        className="group flex items-center gap-3 rounded-full pl-1 pr-1 transition-all hover:bg-slate-50 active:scale-95 sm:pl-3"
      >
        <div className="hidden flex-col items-end text-right sm:flex">
          <span className="text-sm font-bold leading-none text-ink-950">{currentAccount.name}</span>
          <span className="mt-1 text-[10px] font-bold uppercase leading-none tracking-wider text-accent-600">{currentAccount.role}</span>
        </div>
        <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white shadow-sm transition-all group-hover:ring-slate-100">
          {profilePhoto ? (
            <img src={profilePhoto} className="h-full w-full object-cover" alt="Perfil" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-500">
              <User className="h-5 w-5" />
            </div>
          )}
        </div>
      </button>

    </div>
  </div>
</header>
            <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
              <div
                className={
                  currentView === "account" ||
                  currentView === "calendar" ||
                  currentView === "category"
                    ? "grid gap-8"
                    : "grid gap-8"
                }
              >

      <main className="space-y-4 pb-28">
  {currentView === "calendar" ? (
                    <section className="panel space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" id="calendar-page">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Agenda
                          </p>
                          <h2 className="mt-1 text-2xl font-bold text-ink-950">
                            Calendário de eventos
                          </h2>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigateToSection("feed")}
                          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-slate-50"
                        >
                          Voltar ao feed
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => shiftCalendarMonth(-1)}
                          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-ink-700 transition hover:bg-slate-50"
                        >
                          Anterior
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const today = new Date();
                            setCalendarMonth(
                              new Date(
                                today.getFullYear(),
                                today.getMonth(),
                                1,
                              ),
                            );
                          }}
                          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-ink-700 transition hover:bg-slate-50"
                        >
                          Hoje
                        </button>
                        <button
                          type="button"
                          onClick={() => shiftCalendarMonth(1)}
                          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-ink-700 transition hover:bg-slate-50"
                        >
                          Seguinte
                        </button>
                      </div>

                      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.9fr]">
                          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 px-4 py-4 sm:px-5">
                              <h4 className="text-lg font-semibold text-ink-950">
                                {formatMonthYear(calendarMonth).replace(/^./, (letter) => letter.toUpperCase())}
                              </h4>
                            </div>

                            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                              {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map(
                                (dayLabel) => (
                                  <div key={dayLabel} className="px-2 py-3">
                                    {dayLabel}
                                  </div>
                                ),
                              )}
                            </div>

                            <div className="grid grid-cols-7 gap-px bg-slate-200">
                              {calendarDays.map((day, index) => {
                                if (!day) {
                                  return (
                                    <div
                                      key={`empty-${index}`}
                                      className="min-h-28 bg-slate-50/80"
                                    />
                                  );
                                }

                                const dayKey = toDateKey(day);
                                const dayEvents = eventDays[dayKey] || [];
                                const isToday = dayKey === toDateKey(new Date());

                                return (
                                  <div
                                    key={dayKey}
                                    className={
                                      "min-h-28 bg-white p-2 text-sm transition hover:bg-slate-50 " +
                                      (isToday ? "ring-2 ring-inset ring-accent-500" : "")
                                    }
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <span className="text-sm font-semibold text-ink-950">
                                        {day.getDate()}
                                      </span>
                                      {isToday ? (
                                        <span className="rounded-full bg-accent-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-accent-600">
                                          Hoje
                                        </span>
                                      ) : null}
                                    </div>

                                    <div className="mt-2 space-y-1.5">
                                      {dayEvents.length > 0 ? (
                                        dayEvents.slice(0, 2).map((event) => (
                                          <div
                                            key={event.id}
                                            className="rounded-md border border-sky-100 bg-sky-50 px-2 py-1.5 text-xs font-semibold text-sky-800"
                                          >
                                            <p className="leading-4">{event.title}</p>
                                            {event.timeRange ? (
                                              <p className="mt-0.5 text-[10px] font-medium text-sky-700">
                                                {event.timeRange}
                                              </p>
                                            ) : null}
                                          </div>
                                        ))
                                      ) : (
                                        <p className="text-xs text-slate-400">
                                          Sem eventos
                                        </p>
                                      )}

                                      {dayEvents.length > 2 ? (
                                        <p className="text-[11px] font-semibold text-slate-500">
                                          +{dayEvents.length - 2} evento(s)
                                        </p>
                                      ) : null}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                              <div className="flex items-center justify-between gap-3">
                                <h4 className="text-lg font-semibold text-ink-950">
                                  Próximos eventos
                                </h4>
                                <Sparkles className="h-5 w-5 text-slate-500" />
                              </div>

                              <div className="mt-4 space-y-3">
                                {monthEvents.length > 0 ? (
                                  monthEvents.map((event) => (
                                    <article
                                      key={event.id}
                                      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                                    >
                                      <div className="flex items-start justify-between gap-3">
                                        <div>
                                          <p className="text-sm font-semibold text-ink-950">
                                            {event.title}
                                          </p>
                                          <p className="mt-1 text-xs text-slate-500">
                                            {schoolConfig[event.school]?.name || event.school}
                                          </p>
                                          {event.timeRange ? (
                                            <p className="mt-1 text-xs font-semibold text-sky-700">
                                              {event.timeRange}
                                            </p>
                                          ) : null}
                                        </div>
                                        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                          {event.eventDate.toLocaleDateString("pt-PT", {
                                            day: "2-digit",
                                            month: "short",
                                          })}
                                        </div>
                                      </div>
                                      <p className="mt-3 text-sm leading-6 text-ink-600">
                                        {event.description}
                                      </p>
                                    </article>
                                  ))
                                ) : (
                                  <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                                    Ainda não existem eventos marcados para este mês.
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                              <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                                <span className="rounded-full bg-accent-50 px-3 py-1 text-accent-600">
                                  Hoje
                                </span>
                                <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-700">
                                  Evento publicado
                                </span>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                                  Sem eventos
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                  ) : currentView === "account" ? (
                    <section className="panel flex flex-col gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                      {/* Cabeçalho */}
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                            Conta
                          </p>
                          <h2 className="mt-1 text-2xl font-bold text-ink-950">
                            Perfil do utilizador
                          </h2>
                          <p className="mt-1 text-sm text-slate-500">
                            Esta secção está numa página separada do feed
                            principal.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigateToSection("feed")}
                          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-slate-50"
                        >
                          Voltar ao feed
                        </button>
                      </div>

                      <hr className="border-slate-200" />

                      <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Settings
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-ink-950">
                          Mudar foto de perfil
                        </h3>
                        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-20 w-20 overflow-hidden rounded-full border border-slate-200 bg-white">
                              {profilePhoto ? (
                                <img
                                  src={profilePhoto}
                                  alt="Foto de perfil"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-500">
                                  <User className="h-8 w-8" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-ink-950">
                                {profilePhoto ? "Foto atualizada" : "Sem foto definida"}
                              </p>
                              <p className="text-xs text-slate-500">
                                JPG, PNG ou WEBP com tamanho máximo de 2MB.
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-slate-50">
                              Alterar foto
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePhotoChange}
                                className="hidden"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={handleRemoveProfilePhoto}
                              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-slate-50"
                            >
                              Remover foto
                            </button>
                          </div>
                        </div>
                        {profilePhotoError ? (
                          <div className="mt-3 rounded-md border border-coral-100 bg-coral-50 px-3 py-2 text-sm text-coral-500">
                            {profilePhotoError}
                          </div>
                        ) : null}
                      </div>

                      {/* Seção: Calendário Semanal + Anúncios */}
                      {isAluno && (
                        <div className="space-y-6">
                          <hr className="border-slate-200" />
                          
                          {/* Calendário da Semana */}
                          <div>
                            <div className="mb-4">
                              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                                Calendário
                              </p>
                              <h3 className="mt-1 text-lg font-semibold text-ink-950">
                                Horários e Atividades da Semana
                              </h3>
                            </div>

                            {weeklySchedule.length > 0 ? (
                              <div className="grid gap-3 md:grid-cols-5">
                                {[
                                  { day: 1, label: "Segunda" },
                                  { day: 2, label: "Terça" },
                                  { day: 3, label: "Quarta" },
                                  { day: 4, label: "Quinta" },
                                  { day: 5, label: "Sexta" },
                                ].map(({ day, label }) => {
                                  const dayClasses = weeklySchedule.filter(
                                    (cls) => cls.day_of_week === day
                                  );
                                  
                                  return (
                                    <div
                                      key={day}
                                      className="flex flex-col rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4 shadow-sm"
                                    >
                                      <div className="mb-3 flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-100 text-ink-700 text-xs font-bold">
                                          {day}
                                        </div>
                                        <span className="text-sm font-bold text-ink-950">
                                          {label}
                                        </span>
                                      </div>
                                      
                                      {dayClasses.length > 0 ? (
                                        <div className="space-y-2">
                                          {dayClasses.map((cls) => (
                                            <div
                                              key={cls.id}
                                              className="rounded-lg border border-blue-100 bg-blue-50 p-2"
                                            >
                                              <p className="text-xs font-semibold text-blue-900">
                                                {cls.class_name}
                                              </p>
                                              <p className="text-xs text-blue-700">
                                                {cls.start_time.slice(0, 5)} -{" "}
                                                {cls.end_time.slice(0, 5)}
                                              </p>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-xs text-slate-400">
                                          Sem aulas
                                        </p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
                                <CalendarDays className="mx-auto mb-2 h-6 w-6 text-slate-400" />
                                <p className="text-sm text-slate-500">
                                  Nenhum horário de aula registado
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Anúncios da Semana */}
                          <div>
                            <div className="mb-4">
                              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                                Avisos
                              </p>
                              <h3 className="mt-1 text-lg font-semibold text-ink-950">
                                Avisos da Semana
                              </h3>
                            </div>

                            {weeklyAnnouncements.length > 0 ? (
                              <div className="space-y-3">
                                {weeklyAnnouncements.slice(0, 5).map((announcement) => {
                                  const school = schoolConfig[announcement.school];
                                  return (
                                    <div
                                      key={announcement.id}
                                      className="flex gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm hover:border-slate-300 hover:shadow-md transition-all"
                                    >
                                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${school?.badge} text-white text-xs font-bold`}>
                                        {school?.label}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-ink-950 truncate">
                                          {announcement.title}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                          {announcement.category}
                                          {announcement.start_time && announcement.end_time
                                            ? ` • ${announcement.start_time.slice(0, 5)} - ${announcement.end_time.slice(0, 5)}`
                                            : ""}
                                        </p>
                                      </div>
                                      <div className="flex shrink-0 items-center">
                                        <span className="text-xs font-medium text-slate-500">
                                          {formatDate(announcement.expires_at)}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
                                <BellRing className="mx-auto mb-2 h-6 w-6 text-slate-400" />
                                <p className="text-sm text-slate-500">
                                  Nenhum aviso esta semana
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Grelha de Cartões */}
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {/* Cartão: Nome */}
                        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 shadow-sm transition-colors hover:bg-slate-50">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white text-blue-600">
                            {profilePhoto ? (
                              <img
                                src={profilePhoto}
                                alt="Avatar do utilizador"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-blue-100 text-blue-600">
                                <User className="h-6 w-6" />
                              </div>
                            )}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-medium text-slate-500">
                              Nome completo
                            </p>
                            <p className="truncate text-base font-semibold text-ink-950">
                              {currentAccount?.name ||
                                session?.name ||
                                "Sem Nome"}
                            </p>
                          </div>
                        </div>

                        {/* Cartão: Perfil/Role */}
                        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 shadow-sm transition-colors hover:bg-slate-50">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                            <Shield className="h-6 w-6" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-medium text-slate-500">
                              Perfil
                            </p>
                            <p className="truncate text-base font-semibold text-ink-950">
                              {currentAccount?.role || session?.role || "Aluno"}
                            </p>
                          </div>
                        </div>

                        {/* Cartão: Escola */}
                        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 shadow-sm transition-colors hover:bg-slate-50">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
                            <Globe2 className="h-6 w-6" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-medium text-slate-500">
                              Escola
                            </p>
                            <p className="truncate text-base font-semibold text-ink-950">
                              {currentAccount?.school || session?.school || "Sem escola"}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {schoolConfig[currentAccount?.school || session?.school]?.name || "Escola não definida"}
                            </p>
                          </div>
                        </div>

                        {/* Cartão: Email */}
                        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 shadow-sm transition-colors hover:bg-slate-50">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                            <Mail className="h-6 w-6" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-medium text-slate-500">
                              Email
                            </p>
                            <p className="truncate text-base font-semibold text-ink-950">
                              {currentAccount?.email ||
                                session?.email ||
                                "Sem email"}
                            </p>
                          </div>
                        </div>

                        {/* Cartão: Username */}
                        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 shadow-sm transition-colors hover:bg-slate-50">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                            <AtSign className="h-6 w-6" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-medium text-slate-500">
                              Username
                            </p>
                            <p className="truncate text-base font-semibold text-ink-950">
                              @
                              {currentAccount?.username ||
                                session?.username ||
                                "anonimo"}
                            </p>
                          </div>
                        </div>

                        {/* Cartão: Total de Avisos */}
                        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 shadow-sm transition-colors hover:bg-slate-50">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            <FileText className="h-6 w-6" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-medium text-slate-500">
                              Total de avisos
                            </p>
                            <p className="truncate text-base font-semibold text-ink-950">
                              {counts?.total || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </section>
                  ) : (
                    <>
                      {currentView === "dashboard" && currentAccount.role !== "Professor" ? (
                        <section className="scroll-mt-24 space-y-6 pt-2" id="filtros">
                          
                          {/* Barra de Pesquisa e Filtros (Agora flutuante e mais limpa) */}
                          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                            <div className="grid w-full flex-1 gap-3 md:grid-cols-2 xl:grid-cols-[240px_minmax(0,1fr)_auto]">
                              
                              <label className="group flex items-center rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm shadow-sm transition-all focus-within:border-ink-500 focus-within:ring-1 focus-within:ring-ink-500 hover:border-slate-300">
                                <select
                                  value={selectedSchool}
                                  onChange={(event) => setSelectedSchool(event.target.value)}
                                  className="w-full cursor-pointer bg-transparent font-semibold text-ink-950 outline-none"
                                >
                                  {["Todas", ...Object.keys(schoolConfig)].map((school) => (
                                    <option key={school} value={school}>
                                      {school === "Todas" ? "Todas as escolas" : school}
                                    </option>
                                  ))}
                                </select>
                              </label>

                              <label className="group flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm shadow-sm transition-all focus-within:border-ink-500 focus-within:ring-1 focus-within:ring-ink-500 hover:border-slate-300">
                                <Search className="h-4 w-4 text-slate-400 transition-colors group-focus-within:text-ink-500" />
                                <input
                                  value={search}
                                  onChange={(event) => setSearch(event.target.value)}
                                  placeholder="Pesquisar avisos ou categorias..."
                                  className="w-full bg-transparent font-medium text-ink-950 outline-none placeholder:text-slate-400"
                                />
                              </label>

                              <button
                                type="button"
onClick={() => {
                                   setSearch("");
                                   setSelectedSchool("Todas");
                                   setSelectedCategory(null);
                                 }}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-5 py-3 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-100 hover:text-ink-950"
                              >
                                <X className="h-4 w-4" />
                                Limpar
                              </button>
                            </div>
                          </div>

                           {/* Grelha de Categorias (Com animação de entrada e saída) */}
                           <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                             {displayedCategories.length > 0 ? (
                               displayedCategories.map((category, index) => {
                                 const totalForCategory = countsBySchoolAndCategory[category] || 0;
                                 const isExiting = exitingCategories.includes(category);

                                 return (
                                   <button
                                     key={category}
                                     type="button"
                                     onClick={() => navigateToCategoryPage(category)}
                                     className={`group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md ${
                                       isExiting ? 'category-card-exit' : 'category-card'
                                     }`}
                                     style={{
                                       animationDelay: isExiting ? '0ms' : `${Math.round(index * 60 * Math.pow(0.85, index))}ms`,
                                     }}
                                   >
                                    <div>
                                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 transition-colors group-hover:text-slate-500">
                                        Categoria
                                      </p>
                                      <h3 className="mt-1 text-lg font-bold tracking-tight text-ink-950">
                                        {category}
                                      </h3>
                                    </div>
                                    <p className="mt-4 text-xs font-semibold text-slate-500">
                                      {totalForCategory} aviso{totalForCategory === 1 ? "" : "s"}
                                    </p>
                                  </button>
                                 );
                               })
                             ) : (
                               <p className="col-span-full py-8 text-center text-sm text-slate-500">
                                 Selecione uma escola para ver as categorias disponíveis.
                               </p>
                             )}
                           </div>

                           {/* Categorias a sair (invisíveis mas no DOM para animar) */}
                           {exitingCategories.length > 0 && (
                             <div className="sr-only" aria-hidden="true">
                               {exitingCategories.map(category => (
                                 <div key={`exit-${category}`} className="category-card-exit" />
                               ))}
                             </div>
                           )}
                        </section>
                      ) : null}

                      {currentView === "dashboard" && currentAccount.role === "Secretaria" ? (
                        <section
                          className="panel scroll-mt-24 space-y-4 p-4 sm:p-5"
                          id="secretaria"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Administração
                              </p>
                              <h2 className="text-xl font-semibold text-ink-950">
                                Gestão de utilizadores
                              </h2>
                              <p className="text-sm text-ink-600">
                                Adicione novos utilizadores e remova contas existentes.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={loadManagedUsers}
                              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-ink-700 transition hover:bg-slate-50 sm:w-auto"
                            >
                              Atualizar
                            </button>
                          </div>

                          <form
                            className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4"
                            onSubmit={handleCreateUser}
                          >
                            <div className="grid gap-4 sm:grid-cols-2">
                              <label className="block space-y-2 sm:col-span-2">
                                <span className="text-sm font-medium text-ink-700">
                                  Nome completo
                                </span>
                                <input
                                  value={userForm.fullName}
                                  onChange={(event) =>
                                    setUserForm((current) => ({
                                      ...current,
                                      fullName: event.target.value,
                                    }))
                                  }
                                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-ink-900"
                                  placeholder="Nome do utilizador"
                                />
                              </label>

                              <label className="block space-y-2">
                                <span className="text-sm font-medium text-ink-700">
                                  Email
                                </span>
                                <input
                                  type="email"
                                  value={userForm.email}
                                  onChange={(event) =>
                                    setUserForm((current) => ({
                                      ...current,
                                      email: event.target.value,
                                    }))
                                  }
                                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-ink-900"
                                  placeholder="utilizador@uniip.pt"
                                />
                              </label>

                              <label className="block space-y-2">
                                <span className="text-sm font-medium text-ink-700">
                                  Username
                                </span>
                                <input
                                  value={userForm.username}
                                  onChange={(event) =>
                                    setUserForm((current) => ({
                                      ...current,
                                      username: event.target.value,
                                    }))
                                  }
                                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-ink-900"
                                  placeholder="username"
                                />
                              </label>

                              <label className="block space-y-2">
                                <span className="text-sm font-medium text-ink-700">
                                  Password
                                </span>
                                <input
                                  type="password"
                                  value={userForm.password}
                                  onChange={(event) =>
                                    setUserForm((current) => ({
                                      ...current,
                                      password: event.target.value,
                                    }))
                                  }
                                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-ink-900"
                                  placeholder="Mínimo 6 caracteres"
                                />
                              </label>

                              <label className="block space-y-2">
                                <span className="text-sm font-medium text-ink-700">
                                  Perfil
                                </span>
                                <select
                                  value={userForm.role}
                                  onChange={(event) =>
                                    setUserForm((current) => ({
                                      ...current,
                                      role: event.target.value,
                                    }))
                                  }
                                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-ink-900"
                                >
                                  <option value="Aluno">Aluno</option>
                                  <option value="Professor">Professor</option>
                                </select>
                              </label>

                              <label className="block space-y-2">
                                <span className="text-sm font-medium text-ink-700">
                                  Escola
                                </span>
                                <select
                                  value={userForm.school}
                                  onChange={(event) =>
                                    setUserForm((current) => ({
                                      ...current,
                                      school: event.target.value,
                                    }))
                                  }
                                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-ink-900"
                                >
                                  {Object.keys(schoolConfig).map((school) => (
                                    <option key={school} value={school}>
                                      {school} - {schoolConfig[school].name}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            </div>

                            <div className="flex flex-col gap-3 border-t border-slate-200 pt-3 sm:flex-row sm:items-center sm:justify-between">
                              <p className="text-sm text-ink-600">
                                Os novos utilizadores podem iniciar sessão com email ou username.
                              </p>
                              <button
                                type="submit"
                                className="inline-flex w-full items-center justify-center rounded-md bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-800 sm:w-auto"
                              >
                                Criar utilizador
                              </button>
                            </div>
                          </form>

                          {userManagementError ? (
                            <div className="rounded-md border border-coral-100 bg-coral-50 px-4 py-3 text-sm text-coral-500">
                              {userManagementError}
                            </div>
                          ) : null}

                          {userManagementInfo ? (
                            <div className="rounded-md border border-accent-100 bg-accent-50 px-4 py-3 text-sm text-accent-600">
                              {userManagementInfo}
                            </div>
                          ) : null}

                          <div className="space-y-3 md:hidden">
                            {managedUsers.map((user) => {
                              const isCurrentUser = user.id === session?.id;
                              return (
                                <article
                                  key={user.id}
                                  className="rounded-lg border border-slate-200 bg-white p-4"
                                >
                                  <div className="space-y-2 text-sm">
                                    <p className="font-semibold text-ink-950">{user.full_name}</p>
                                    <p className="text-ink-700">@{user.username}</p>
                                    <p className="break-all text-ink-700">{user.email}</p>
                                    <div className="flex flex-wrap gap-2 text-xs">
                                      <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-600">
                                        {user.role}
                                      </span>
                                      <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-600">
                                        {user.school}
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    disabled={isCurrentUser}
                                    onClick={() => handleDeleteUser(user.id)}
                                    className={
                                      "mt-3 w-full rounded-md px-3 py-2 text-xs font-semibold transition " +
                                      (isCurrentUser
                                        ? "cursor-not-allowed bg-slate-100 text-slate-400"
                                        : "bg-coral-50 text-coral-500 hover:bg-coral-100")
                                    }
                                  >
                                    Remover
                                  </button>
                                </article>
                              );
                            })}

                            {managedUsers.length === 0 && !userManagementLoading ? (
                              <div className="rounded-lg border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
                                Sem utilizadores para mostrar.
                              </div>
                            ) : null}

                            {userManagementLoading ? (
                              <div className="rounded-lg border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
                                A carregar utilizadores...
                              </div>
                            ) : null}
                          </div>

                          <div className="hidden overflow-hidden rounded-lg border border-slate-200 md:block">
                            <table className="min-w-full divide-y divide-slate-200 bg-white text-sm">
                              <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.14em] text-slate-500">
                                <tr>
                                  <th className="px-4 py-3">Nome</th>
                                  <th className="px-4 py-3">Username</th>
                                  <th className="px-4 py-3">Email</th>
                                  <th className="px-4 py-3">Perfil</th>
                                  <th className="px-4 py-3">Escola</th>
                                  <th className="px-4 py-3 text-right">Ação</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 text-ink-700">
                                {managedUsers.map((user) => {
                                  const isCurrentUser = user.id === session?.id;
                                  return (
                                    <tr key={user.id}>
                                      <td className="px-4 py-3 font-semibold text-ink-950">
                                        {user.full_name}
                                      </td>
                                      <td className="px-4 py-3">@{user.username}</td>
                                      <td className="px-4 py-3">{user.email}</td>
                                      <td className="px-4 py-3">{user.role}</td>
                                      <td className="px-4 py-3">{user.school}</td>
                                      <td className="px-4 py-3 text-right">
                                        <button
                                          type="button"
                                          disabled={isCurrentUser}
                                          onClick={() => handleDeleteUser(user.id)}
                                          className={
                                            "rounded-md px-3 py-1.5 text-xs font-semibold transition " +
                                            (isCurrentUser
                                              ? "cursor-not-allowed bg-slate-100 text-slate-400"
                                              : "bg-coral-50 text-coral-500 hover:bg-coral-100")
                                          }
                                        >
                                          Remover
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                                {managedUsers.length === 0 && !userManagementLoading ? (
                                  <tr>
                                    <td
                                      colSpan="6"
                                      className="px-4 py-8 text-center text-sm text-slate-500"
                                    >
                                      Sem utilizadores para mostrar.
                                    </td>
                                  </tr>
                                ) : null}
                                {userManagementLoading ? (
                                  <tr>
                                    <td
                                      colSpan="6"
                                      className="px-4 py-8 text-center text-sm text-slate-500"
                                    >
                                      A carregar utilizadores...
                                    </td>
                                  </tr>
                                ) : null}
                              </tbody>
                            </table>
                          </div>
                        </section>
                      ) : null}

                      {currentView === "dashboard" && currentAccount.role === "Professor" ? (
                        <section
                          className="panel scroll-mt-24 space-y-4 p-5"
                          id="professor"
                        >
                          <div className="flex items-end justify-between gap-4">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Publicação
                              </p>
                              <h2 className="text-xl font-semibold text-ink-950">
                                Área do professor
                              </h2>
                              <p className="text-sm text-ink-600">
                                Crie um aviso novo sem sair do feed.
                              </p>
                            </div>
                            <div className="hidden text-sm font-semibold text-ink-700 md:block">
                              Modo de edição ativo
                            </div>
                          </div>

                          <form
                            className="grid gap-4 lg:grid-cols-[1.4fr_1fr]"
                            onSubmit={handleCreateAnnouncement}
                          >
                            <div className="space-y-4">
                              <label className="block space-y-2">
                                <span className="text-sm font-medium text-ink-700">
                                  Título
                                </span>
                                <input
                                  value={announcementForm.title}
                                  onChange={(event) =>
                                    setAnnouncementForm((current) => ({
                                      ...current,
                                      title: event.target.value,
                                    }))
                                  }
                                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-ink-900"
                                  placeholder="Ex.: Reunião extraordinária"
                                />
                              </label>

                              <label className="block space-y-2">
                                <span className="text-sm font-medium text-ink-700">
                                  Descrição
                                </span>
                                <textarea
                                  value={announcementForm.description}
                                  onChange={(event) =>
                                    setAnnouncementForm((current) => ({
                                      ...current,
                                      description: event.target.value,
                                    }))
                                  }
                                  rows="5"
                                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-ink-900"
                                  placeholder="Escreva o aviso com contexto e instruções claras..."
                                />
                              </label>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:content-start">
                              <label className="block space-y-2">
                                <span className="text-sm font-medium text-ink-700">
                                  Escola
                                </span>
                                <select
                                  value={announcementForm.school}
                                  onChange={(event) =>
                                    setAnnouncementForm((current) => ({
                                      ...current,
                                      school: event.target.value,
                                    }))
                                  }
                                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-ink-900"
                                >
                                  {Object.keys(schoolConfig).map((school) => (
                                    <option key={school} value={school}>
                                      {school} - {schoolConfig[school].name}
                                    </option>
                                  ))}
                                </select>
                              </label>

                              <label className="block space-y-2">
                                <span className="text-sm font-medium text-ink-700">
                                  Categoria
                                </span>
                                <select
                                  value={announcementForm.category}
                                  onChange={(event) =>
                                    setAnnouncementForm((current) => ({
                                      ...current,
                                      category: event.target.value,
                                    }))
                                  }
                                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-ink-900"
                                >
                                  {Object.keys(categoryConfig).map(
                                    (category) => (
                                      <option key={category} value={category}>
                                        {category}
                                      </option>
                                    ),
                                  )}
                                </select>
                              </label>

                              <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block space-y-2">
                                  <span className="text-sm font-medium text-ink-700">
                                    Hora de início
                                  </span>
                                  <input
                                    type="time"
                                    value={announcementForm.startTime}
                                    onChange={(event) =>
                                      setAnnouncementForm((current) => ({
                                        ...current,
                                        startTime: event.target.value,
                                      }))
                                    }
                                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-ink-900"
                                  />
                                </label>

                                <label className="block space-y-2">
                                  <span className="text-sm font-medium text-ink-700">
                                    Hora de fim
                                  </span>
                                  <input
                                    type="time"
                                    value={announcementForm.endTime}
                                    onChange={(event) =>
                                      setAnnouncementForm((current) => ({
                                        ...current,
                                        endTime: event.target.value,
                                      }))
                                    }
                                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-ink-900"
                                  />
                                </label>
                              </div>

                              <label className="block space-y-2">
                                <span className="text-sm font-medium text-ink-700">
                                  Data do Evento
                                </span>
                                <input
                                  type="date"
                                  value={announcementForm.expiresAt}
                                  onChange={(event) =>
                                    setAnnouncementForm((current) => ({
                                      ...current,
                                      expiresAt: event.target.value,
                                    }))
                                  }
                                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-ink-900"
                                />
                              </label>

                              <label className="block space-y-2">
                                <span className="text-sm font-medium text-ink-700">
                                  Limite máximo de inscrições (opcional)
                                </span>
                                <input
                                  type="number"
                                  min="1"
                                  value={announcementForm.maxRegistrations}
                                  onChange={(event) =>
                                    setAnnouncementForm((current) => ({
                                      ...current,
                                      maxRegistrations: event.target.value,
                                    }))
                                  }
                                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-ink-900"
                                  placeholder="Ex.: 30"
                                />
                              </label>

                              <div className="flex items-end">
                                <button
                                  type="submit"
                                  className="inline-flex w-full items-center justify-center rounded-md bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-800"
                                >
                                  Publicar aviso
                                </button>
                              </div>
                            </div>
                          </form>

                          {professorAnnouncements.length > 0 && (
                            <div className="mt-6 grid gap-4 lg:grid-cols-2">
                              <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-emerald-700">
                                  Avisos Ativos ({professorAnnouncements.filter((a) => !isExpired(a.expires_at)).length})
                                </h3>
                                <div className="flex flex-col gap-2">
                                  {professorAnnouncements
                                    .filter((a) => !isExpired(a.expires_at))
                                    .map((a) => {
                                      const regs = announcementRegistrations[a.id] || [];
                                      const regCount = a.registrations_count || 0;
                                      const isExpanded = expandedRegistration === a.id;

                                      return (
                                        <div
                                          key={a.id}
                                          className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50"
                                        >
                                          <div className="flex items-center justify-between gap-3 px-3 py-2">
                                            <div className="min-w-0 flex-1">
                                              <p className="truncate text-sm font-medium text-ink-950">
                                                {a.title}
                                              </p>
                                              <p className="text-xs text-slate-500">
                                                {a.category} · {a.expires_at}
                                              </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <button
                                                onClick={() => setExpandedRegistration(isExpanded ? null : a.id)}
                                                className="shrink-0 rounded-md bg-ink-900 px-2 py-1 text-xs font-semibold text-white transition hover:bg-ink-800 dark:bg-slate-600 dark:hover:bg-slate-500"
                                              >
                                                {regCount} inscrito{regCount === 1 ? "" : "s"}
                                              </button>
                                              <button
                                                onClick={() => handleDeleteAnnouncement(a.id)}
                                                className="shrink-0 rounded-md border border-coral-200 bg-white px-3 py-1.5 text-xs font-semibold text-coral-600 transition hover:bg-coral-50 dark:border-coral-800 dark:bg-slate-700 dark:text-coral-400 dark:hover:bg-slate-600"
                                              >
                                                Remover
                                              </button>
                                            </div>
                                          </div>

                                          {isExpanded && (
                                            <div className="border-t border-slate-200 px-3 py-2">
                                              {regs.length > 0 ? (
                                                <div className="flex flex-col gap-1">
                                                  {regs.map((reg) => (
                                                    <div
                                                      key={reg.student_id}
                                                      className="flex items-center justify-between rounded-md bg-white px-3 py-1.5"
                                                    >
                                                      <div className="min-w-0">
                                                        <p className="text-sm font-medium text-ink-950">
                                                          {reg.full_name}
                                                        </p>
                                                        <p className="truncate text-xs text-slate-500">
                                                          {reg.username}
                                                        </p>
                                                      </div>
                                                      <span className="shrink-0 text-xs text-slate-400">
                                                        {new Date(reg.registered_at).toLocaleDateString("pt-PT")}
                                                      </span>
                                                    </div>
                                                  ))}
                                                </div>
                                              ) : (
                                                <p className="text-xs text-slate-400 py-1">A carregar inscritos...</p>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>

                              <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-slate-500">
                                  Avisos Expirados ({professorAnnouncements.filter((a) => isExpired(a.expires_at)).length})
                                </h3>
                                <div className="flex flex-col gap-2">
                                  {professorAnnouncements
                                    .filter((a) => isExpired(a.expires_at))
                                    .map((a) => {
                                      const regs = announcementRegistrations[a.id] || [];
                                      const regCount = a.registrations_count || 0;
                                      const isExpanded = expandedRegistration === a.id;

                                      return (
                                        <div
                                          key={a.id}
                                          className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 opacity-60"
                                        >
                                          <div className="flex items-center justify-between gap-3 px-3 py-2">
                                            <div className="min-w-0 flex-1">
                                              <p className="truncate text-sm font-medium text-ink-950">
                                                {a.title}
                                              </p>
                                              <p className="text-xs text-slate-500">
                                                {a.category} · {a.expires_at}
                                              </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <button
                                                onClick={() => setExpandedRegistration(isExpanded ? null : a.id)}
                                                className="shrink-0 rounded-md bg-ink-900 px-2 py-1 text-xs font-semibold text-white transition hover:bg-ink-800 dark:bg-slate-600 dark:hover:bg-slate-500"
                                              >
                                                {regCount} inscrito{regCount === 1 ? "" : "s"}
                                              </button>
                                              <button
                                                onClick={() => handleDeleteAnnouncement(a.id)}
                                                className="shrink-0 rounded-md border border-coral-200 bg-white px-3 py-1.5 text-xs font-semibold text-coral-600 transition hover:bg-coral-50 dark:border-coral-800 dark:bg-slate-700 dark:text-coral-400 dark:hover:bg-slate-600"
                                              >
                                                Remover
                                              </button>
                                            </div>
                                          </div>

                                          {isExpanded && regs.length > 0 && (
                                            <div className="border-t border-slate-200 px-3 py-2">
                                              <div className="flex flex-col gap-1">
                                                {regs.map((reg, i) => (
                                                  <div
                                                    key={reg.student_id}
                                                    className="flex items-center justify-between rounded-md bg-white px-3 py-1.5"
                                                  >
                                                    <div className="min-w-0">
                                                      <p className="text-sm font-medium text-ink-950">
                                                        {reg.full_name}
                                                      </p>
                                                      <p className="truncate text-xs text-slate-500">
                                                        {reg.username}
                                                      </p>
                                                    </div>
                                                    <span className="shrink-0 text-xs text-slate-400">
                                                      {new Date(reg.registered_at).toLocaleDateString("pt-PT")}
                                                    </span>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                            </div>
                          )}

                          {publishError ? (
                            <p className="rounded-md border border-coral-100 bg-coral-50 px-3 py-2 text-sm text-coral-500">
                              {publishError}
                            </p>
                          ) : null}
                        </section>
                      ) : null}

                      {currentView === "forums" ? (
                        <section className="panel space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Comunicação
                              </p>
                              <h2 className="mt-1 text-2xl font-bold text-ink-950">
                                Fóruns de Eventos
                              </h2>
                              <p className="mt-1 text-sm text-slate-500">
                                Discussões dos eventos onde está inscrito ou é o autor.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => navigateToSection("feed")}
                              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-slate-50"
                            >
                              Voltar ao feed
                            </button>
                          </div>

                            <div className="grid gap-6 lg:grid-cols-[320px_1fr_200px]">
                             {/* Lista de Fóruns */}
                             <div className="space-y-3">
                               <h3 className="text-sm font-semibold text-ink-700">
                                 Meus Fóruns ({myForums.length})
                               </h3>
                               <div className="max-h-[500px] space-y-2 overflow-y-auto">
                                 {myForums.length > 0 ? (
                                   myForums.map((forum) => (
                                     <button
                                       key={forum.id}
                                       onClick={() => {
                                         setSelectedForum(forum);
                                         loadForumMessages(forum.id);
                                       }}
                                       className={`w-full rounded-lg border p-3 text-left transition-all ${
                                         selectedForum?.id === forum.id
                                           ? "border-ink-900 bg-ink-50"
                                           : "border-slate-200 bg-white hover:border-slate-300"
                                       }`}
                                     >
                                       <p className="text-sm font-semibold text-ink-950">
                                         {forum.title}
                                       </p>
                                       <p className="mt-1 text-xs text-slate-500">
                                         {forum.category} · {schoolConfig[forum.school]?.label}
                                       </p>
                                     </button>
                                   ))
                                 ) : (
                                   <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                                     Nenhum fórum disponível. Inscreva-se em eventos para participar.
                                   </p>
                                 )}
                               </div>
                             </div>

                             {/* Chat do Fórum */}
                             <div className="flex flex-col rounded-xl border border-slate-200 bg-slate-50/50">
                               {selectedForum ? (
                                 <>
                                   <div className="border-b border-slate-200 bg-white px-4 py-3 rounded-t-xl">
                                     <p className="text-sm font-semibold text-ink-950">
                                       {selectedForum.title}
                                     </p>
                                     <p className="text-xs text-slate-500">
                                       {selectedForum.description?.slice(0, 60)}...
                                     </p>
                                   </div>

                                   <div className="flex-1 space-y-3 overflow-y-auto p-4" style={{ minHeight: "400px", maxHeight: "500px" }}>
                                     {forumMessages.map((msg) => (
                                       <div
                                         key={msg.id}
                                         className={`flex group ${msg.user_id === session?.id ? "justify-end" : "justify-start"}`}
                                       >
                                         <div
                                           className={`relative max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                                             msg.user_id === session?.id
                                               ? "bg-ink-950 text-white"
                                               : "bg-white border border-slate-200 text-ink-950"
                                           }`}
                                         >
                                           <p className="text-xs font-semibold mb-1">
                                             {msg.user_name}
                                           </p>
                                           <p>{msg.content}</p>
                                           <p className="mt-1 text-[10px] opacity-60">
                                             {new Date(msg.created_at).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}
                                           </p>
                                           {(msg.user_id === session?.id || selectedForum?.author_id === session?.id) && (
                                             <button
                                               onClick={() => {
                                                 if (window.confirm("Apagar esta mensagem?")) {
                                                   deleteForumMessage(msg.id);
                                                 }
                                               }}
                                               className="absolute -top-2 -right-2 invisible flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white transition hover:bg-red-600 group-hover:visible"
                                               title="Apagar mensagem"
                                             >
                                               ×
                                             </button>
                                           )}
                                         </div>
                                       </div>
                                     ))}
                                     <div ref={forumMessagesEndRef} />
                                   </div>

                                   <div className="border-t border-slate-200 bg-white p-3 rounded-b-xl">
                                     <form
                                       onSubmit={(e) => {
                                         e.preventDefault();
                                         sendForumMessage();
                                       }}
                                       className="flex gap-2"
                                     >
                                       <input
                                         value={newMessage}
                                         onChange={(e) => setNewMessage(e.target.value)}
                                         placeholder="Escreva uma mensagem..."
                                         className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-ink-700"
                                       />
                                       <button
                                         type="submit"
                                         disabled={!newMessage.trim()}
                                         className="rounded-lg bg-ink-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink-800 disabled:opacity-50"
                                       >
                                         Enviar
                                       </button>
                                     </form>
                                   </div>
                                 </>
                               ) : (
                                 <div className="flex flex-1 items-center justify-center p-8">
                                   <p className="text-sm text-slate-500">
                                     Selecione um fórum para ver as mensagens.
                                   </p>
                                 </div>
                               )}
                             </div>

                             {/* Users Sidebar - Online e Offline */}
                             <div className="rounded-xl border border-slate-200 bg-white p-3">
                               <h3 className="text-xs font-semibold text-ink-700 mb-3">
                                 Utilizadores ({allForumUsers.length})
                               </h3>
                               <div className="space-y-2 max-h-[500px] overflow-y-auto">
                                 {allForumUsers.length > 0 ? (
                                   allForumUsers.map((user, index) => {
                                     const isOnline = onlineUsers.includes(user.id);
                                     return (
                                       <div key={user.id || index} className="flex items-center gap-2 text-sm">
                                         <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                         <span className={`${isOnline ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                                           {user.username}
                                         </span>
                                         {isOnline && <span className="text-[10px] text-green-600">online</span>}
                                       </div>
                                     );
                                   })
                                 ) : (
                                   <p className="text-xs text-slate-500">Nenhum utilizador</p>
                                 )}
                               </div>
                             </div>
                           </div>
                        </section>
                      ) : null}

                      {currentView === "category" && currentAccount.role !== "Professor" ? (
                        <>
                          <div
                            className="scroll-mt-24 flex flex-col gap-3 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between"
                            id="feed"
                          >
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                  Categoria
                                </p>
                                {selectedSchool !== "Todas" && (
                                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                                    {schoolConfig[selectedSchool]?.name || selectedSchool}
                                  </span>
                                )}
                              </div>
                              <h2 className="text-xl font-semibold text-ink-950">
                                {selectedCategory}
                              </h2>
                              <p className="mt-1 text-sm text-slate-500">
                                {selectedSchool === "Todas"
                                  ? "Todas as escolas"
                                  : `Escola: ${schoolConfig[selectedSchool]?.name || selectedSchool}`}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => navigateToSection("feed")}
                              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-slate-50"
                            >
                              Voltar às categorias
                            </button>
                          </div>

                          {registrationInfo ? (
                            <p className="rounded-md border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                              {registrationInfo}
                            </p>
                          ) : null}

                          {registrationError ? (
                            <p className="rounded-md border border-coral-100 bg-coral-50 px-3 py-2 text-sm text-coral-500">
                              {registrationError}
                            </p>
                          ) : null}

                         {visibleAnnouncements.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-16 text-center">
                              <h3 className="text-lg font-semibold text-ink-950">
                                Sem avisos nesta categoria
                              </h3>
                              <p className="mt-2 text-sm text-slate-500">
                                Tente pesquisar outro termo ou escolher outra categoria.
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-5 pb-6">
                              {visibleAnnouncements.map((announcement) => {
                                const school = schoolConfig[announcement.school];
                                const schoolName = school.name;
                                const expired = isExpired(announcement.expires_at);
                                const registrationsCount = announcement.registrations_count || 0;
                                const hasLimit = announcement.max_registrations != null;
                                const isFull = hasLimit && registrationsCount >= announcement.max_registrations;
                                const isRegistered = Boolean(announcement.user_registered);
                                const canRegister = isAluno && !expired && (isRegistered || !isFull);
                                const isBusy = registrationActionId === announcement.id;

                                const schoolIcon =
                                  announcement.school === "ESE" ? BookOpen
                                : announcement.school === "EST" ? GraduationCap
                                : announcement.school === "ESS" ? HeartHandshake
                                : Globe2;

                               return (
                                  <article
                                    key={announcement.id}
                                    className={`group relative flex flex-col gap-4 overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 sm:p-6 ${
                                      expired 
                                        ? "border-slate-200/50 opacity-75 grayscale-[15%]" 
                                        : "border-slate-200/80 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
                                    }`}
                                  >
                                    {/* NOVA LINHA DE COR: Lateral esquerda em vez de topo */}
                                    <div className={`absolute bottom-0 left-0 top-0 w-1.5 ${school.badge}`} />

                                    {/* Cabeçalho do Cartão: Badges todos agrupados na esquerda */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 pl-2">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${school.classes}`}>
                                          {React.createElement(schoolIcon, { className: "h-3.5 w-3.5" })}
                                          {school.label}
                                        </span>
                                        <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                          {announcement.category}
                                        </span>
                                        {/* Tag EXPIRADO movida para junto das outras */}
                                        {expired ? (
                                          <span className="inline-flex items-center rounded-md border border-coral-100 bg-coral-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-coral-600">
                                            Expirado
                                          </span>
                                        ) : null}
                                      </div>
                                    </div>

                                    {/* Corpo Principal (Título e Descrição) */}
                                    <div className="mt-1 pl-2">
                                      <h3 className={`text-xl font-bold tracking-tight sm:text-2xl ${expired ? 'text-slate-500' : 'text-ink-950'}`}>
                                        {announcement.title}
                                      </h3>
                                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                                        {announcement.description}
                                      </p>
                                    </div>

                                    {/* Metadados e Ações */}
                                    <div className="mt-2 flex flex-col gap-4 border-t border-slate-100 pt-4 pl-2 sm:flex-row sm:items-center sm:justify-between">
                                      
                                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
                                        <div className="flex items-center gap-1.5" title={schoolName}>
                                          <MapPin className="h-4 w-4 text-slate-400" />
                                          <span className="hidden sm:inline">{schoolName}</span>
                                          <span className="sm:hidden">{announcement.school}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <Users className="h-4 w-4 text-slate-400" />
                                          <span>
                                            {hasLimit
                                              ? `${registrationsCount}/${announcement.max_registrations} vagas`
                                              : `${registrationsCount} inscritos`}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <CalendarDays className="h-4 w-4 text-slate-400" />
                                          <span>
                                            {announcement.category === "Evento"
                                              ? `Dia ${formatDate(announcement.expires_at)}`
                                              : `Até ${formatDate(announcement.expires_at)}`}
                                          </span>
                                        </div>
                                        {announcement.start_time && announcement.end_time ? (
                                          <div className="flex items-center gap-1.5">
                                            <Clock className="h-4 w-4 text-slate-400" />
                                            <span>
                                              {formatEventTimeRange(
                                                announcement.start_time,
                                                announcement.end_time,
                                              )}
                                            </span>
                                          </div>
                                        ) : null}
                                      </div>

                                      {isAluno ? (
                                        <button
                                          type="button"
                                          disabled={!canRegister || isBusy}
                                          onClick={() => handleToggleRegistration(announcement)}
                                          className={
                                            "shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all " +
                                            (canRegister && !isBusy
                                              ? isRegistered
                                                ? "border border-slate-200 bg-white text-slate-600 hover:border-coral-200 hover:bg-coral-50 hover:text-coral-600"
                                                : "bg-ink-950 text-white shadow-sm hover:-translate-y-0.5 hover:bg-ink-800 hover:shadow-md"
                                              : "cursor-not-allowed bg-slate-100 text-slate-400")
                                          }
                                        >
                                          {/* LÓGICA MELHORADA DO BOTÃO */}
                                          {isBusy
                                            ? "A processar..."
                                            : expired 
                                              ? "Encerrado" 
                                              : isRegistered
                                                ? "Cancelar inscrição"
                                                : isFull
                                                  ? "Vagas Esgotadas"
                                                  : "Inscrever agora"}
                                        </button>
                                      ) : null}
                                    </div>
                                  </article>
                                );
                              })}
                            </div>
                          )}
                        </>
                      ) : null}
                    </>
                  )}
                </main>
              </div>
            </div>
            {/* Navegação Flutuante (Estilo App iOS) */}
          <nav className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-slate-200/80 bg-white/80 p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-xl transition-all">
            <button
              onClick={() => navigateToSection("feed")}
              className={`relative rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                currentView === "dashboard" || currentView === "category"
                  ? "bg-ink-950 text-white shadow-md scale-100"
                  : "text-slate-500 hover:bg-slate-100/80 hover:text-ink-900 scale-95 hover:scale-100"
              }`}
            >
              Feed
            </button>
            <button
              onClick={navigateToCalendarPage}
              className={`relative rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                currentView === "calendar"
                  ? "bg-ink-950 text-white shadow-md scale-100"
                  : "text-slate-500 hover:bg-slate-100/80 hover:text-ink-900 scale-95 hover:scale-100"
              }`}
            >
              Calendário
            </button>
            <button
              onClick={navigateToForumsPage}
              className={`relative rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                currentView === "forums"
                  ? "bg-ink-950 text-white shadow-md scale-100"
                  : "text-slate-500 hover:bg-slate-100/80 hover:text-ink-900 scale-95 hover:scale-100"
              }`}
            >
              Fóruns
            </button>
          </nav>

          {/* Modal de Conflito de Horário */}
          {scheduleConflict && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
                <div className="border-b border-coral-200 bg-coral-50 px-6 py-4 dark:border-coral-900/30 dark:bg-coral-950/40">
                  <h2 className="text-lg font-bold text-coral-900 dark:text-coral-200">⚠️ Conflito de Horário Detectado</h2>
                </div>
                <div className="px-6 py-4">
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Você tem aulas agendadas durante este evento:
                  </p>
                  <div className="mt-3 rounded-lg bg-coral-50 p-3 border border-coral-200 dark:bg-coral-950/30 dark:border-coral-900/30">
                    <p className="text-sm font-semibold text-coral-900 dark:text-coral-200">
                      {scheduleConflict.conflictingClasses}
                    </p>
                  </div>
                  <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                    <strong>Evento:</strong> {scheduleConflict.announcement?.title}
                  </p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    <strong>Horário:</strong> {scheduleConflict.announcement?.start_time} - {scheduleConflict.announcement?.end_time}
                  </p>
                  <p className="mt-3 rounded-lg bg-amber-50 p-3 border border-amber-200 text-sm text-amber-900 dark:bg-amber-950/30 dark:border-amber-900/30 dark:text-amber-200">
                    💡 Tem a certeza de que deseja inscrever-se mesmo com este conflito?
                  </p>
                </div>
                <div className="flex gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-700">
                  <button
                    onClick={handleCancelConflictDialog}
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmRegistrationWithConflict}
                    className="flex-1 rounded-lg bg-coral-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-coral-700 dark:bg-coral-700 dark:hover:bg-coral-600"
                  >
                    Inscrever Mesmo Assim
                  </button>
                </div>
              </div>
            </div>
          )}
          </div>
        );
      }

      function splitLoginIdentifier(value) {
        return String(value || "").split("@")[0];
      }

      const handleDefaultHash = () => { const defaultHash = document.body.dataset.defaultHash; if (defaultHash && !window.location.hash) { window.location.hash = defaultHash; } }; handleDefaultHash(); ReactDOM.createRoot(document.getElementById("root")).render(
        <Dashboard />,
      );
    