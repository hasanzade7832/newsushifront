// src/components/MenuHeader.tsx
"use client";

import { useRef, useState, useEffect, type SyntheticEvent } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from "@mui/material/useMediaQuery";

const CATEGORIES = [
  "همه",
  "سوشی کلاسیک",
  "سوشی ویژه",
  "سوشی مرغ و گوشت",
  "سوشی سبزیجات",
  "رول‌های خاص",
  "سالاد",
  "نوشیدنی",
  "پیش‌غذا",
  "غذای گرم",
  "دسر",
  "غذاهای ترکیبی",
];

export default function MenuHeader() {
  // تب پیش‌فرض: "همه"
  const [value, setValue] = useState(0);

  // ref برای هر تب (برای scrollIntoView)
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ref ظرف اسکرول افقی
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // تشخیص موبایل
  const isMobile = useMediaQuery("(max-width:768px)");

  // وضعیت مودال موبایل
  const [menuOpen, setMenuOpen] = useState(false);

  // جهت واقعی scrollLeft (برای سازگاری با RTL/LTR)
  const [scrollSign, setScrollSign] = useState(1);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);

  // تشخیص اینکه scrollLeft مثبت به کدام سمت می‌رود
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const start = el.scrollLeft;
    el.scrollLeft += 1;
    const end = el.scrollLeft;
    const delta = end - start;
    const sign = delta === 0 ? 1 : delta > 0 ? 1 : -1;
    el.scrollLeft = start;
    setScrollSign(sign);
  }, []);

  // به‌روزرسانی فعال بودن فلش‌ها
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const updateButtons = () => {
      const node = scrollContainerRef.current;
      if (!node) return;

      const maxScroll = node.scrollWidth - node.clientWidth;
      if (maxScroll <= 0) {
        setCanScrollBack(false);
        setCanScrollForward(false);
        return;
      }

      const raw = node.scrollLeft;
      const pos = scrollSign >= 0 ? raw : -raw;

      setCanScrollBack(pos > 1);
      setCanScrollForward(pos < maxScroll - 1);
    };

    updateButtons();

    el.addEventListener("scroll", updateButtons);
    window.addEventListener("resize", updateButtons);

    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [scrollSign]);

  // اسکرول با فلش‌ها
  const scrollTabs = (direction: "back" | "forward") => {
    const el = scrollContainerRef.current;
    if (!el) return;

    // back = رفتن به سمت شروع لیست (سمت «همه» در RTL)
    const amount = 150 * scrollSign * (direction === "forward" ? 1 : -1);
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  // تغییر تب + اسکرول نرم روی تب انتخاب‌شده
  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue);

    const el = tabRefs.current[newValue];
    if (el?.scrollIntoView) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "white",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      {/* نسخه موبایل: منوی همبرگری */}
      {isMobile ? (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1.5,
            }}
          >
            {/* لوگو سمت راست */}
            <Box
              sx={{
                fontWeight: 800,
                fontSize: 20,
                color: "#065f46",
              }}
            >
              LoGo
            </Box>

            {/* دکمه همبرگری */}
            <IconButton
              onClick={() => setMenuOpen(true)}
              aria-label="باز کردن منو"
              sx={{
                borderRadius: "999px",
                border: "1px solid rgba(16,185,129,0.3)",
                bgcolor: "rgba(16,185,129,0.05)",
              }}
            >
              <MenuIcon sx={{ color: "#047857" }} />
            </IconButton>
          </Box>

          {/* مودال دسته‌ها در موبایل */}
          <Dialog
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            fullWidth
            maxWidth="xs"
          >
            <DialogTitle
              sx={{
                textAlign: "center",
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              دسته‌بندی‌ها
            </DialogTitle>
            <DialogContent dividers>
              <List>
                {CATEGORIES.map((cat, index) => (
                  <ListItemButton
                    key={cat}
                    selected={index === value}
                    onClick={() => {
                      setValue(index);
                      setMenuOpen(false);
                    }}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                    }}
                  >
                    <ListItemText
                      primary={cat}
                      sx={{ textAlign: "center" }}
                      primaryTypographyProps={{
                        fontWeight: index === value ? 700 : 500,
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        // نسخه دسکتاپ: تب‌های اسکرول‌دار + فلش‌های سفارشی
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
          }}
        >
          {/* فلش سمت راست: رفتن به سمت «همه» و گزینه‌های اول */}
          <IconButton
            onClick={() => scrollTabs("back")}
            aria-label="اسکرول به سمت راست (همه)"
            disabled={!canScrollBack}
            sx={{
              color: canScrollBack ? "#047857" : "#d1d5db",
              "&:hover": {
                bgcolor: canScrollBack ? "rgba(4,120,87,0.08)" : "transparent",
              },
            }}
          >
            {/* اینجا برعکس شد: سمت راست فلش به چپ نگاه کند */}
            <ChevronLeftIcon />
          </IconButton>

          {/* ظرف اسکرول افقی؛ تب‌ها تا جایی که جا می‌شوند وسط قرار می‌گیرند */}
          <Box
            ref={scrollContainerRef}
            sx={{
              flex: 1,
              mx: 1,
              overflowX: "auto",
              overflowY: "hidden",
              display: "flex",
              justifyContent: "center",
              "&::-webkit-scrollbar": {
                display: "none",
              },
              scrollbarWidth: "none",
            }}
          >
            <Tabs
              dir="rtl"
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons={false}
              allowScrollButtonsMobile={false}
              textColor="primary"
              indicatorColor="primary"
              sx={{
                minWidth: "max-content",
                "& .MuiTab-root": {
                  fontWeight: 700,
                  fontSize: { xs: 14, md: 16 },
                },
              }}
            >
              {CATEGORIES.map((cat, index) => (
                <Tab
                  key={cat}
                  label={cat}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                />
              ))}
            </Tabs>
          </Box>

          {/* فلش سمت چپ: رفتن به سمت گزینه‌های بعدی */}
          <IconButton
            onClick={() => scrollTabs("forward")}
            aria-label="اسکرول به سمت چپ"
            disabled={!canScrollForward}
            sx={{
              color: canScrollForward ? "#047857" : "#d1d5db",
              "&:hover": {
                bgcolor: canScrollForward
                  ? "rgba(4,120,87,0.08)"
                  : "transparent",
              },
            }}
          >
            {/* اینم برعکسِ قبلی: سمت چپ فلش به راست نگاه کند */}
            <ChevronRightIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
