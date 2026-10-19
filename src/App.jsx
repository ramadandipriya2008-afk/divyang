import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import {
  IconWheelchair,
  IconCrutches,
  IconWalker,
  IconDonations,
  IconInventory,
  IconStatus,
  IconPurchase,
  IconNGO,
  IconBell,
  IconResale,
  IconProfile,
  IconLogout,
  IconSearch,
  IconShieldCheck,
  IconCheck,
  IconEdit,
  IconTrash,
  IconZap,
  IconTruck,
  IconMenu,
  IconChevronLeft,
  IconChevronRight
} from "./components/Icons";
import { translations, getTranslation } from "./translations";

const initialDevices = [
  { id:"DS-D-24018", name:"Folding manual wheelchair", category:"Wheelchair", condition:"Repairable", state:"Telangana", district:"Hyderabad", date:"13 Oct 2026", status:"Inspection Pending", qty:1, stage:4, image:"/images/wheelchair_manual.png" },
  { id:"DS-D-24012", name:"Adjustable elbow crutches", category:"Crutches", condition:"Working", state:"Telangana", district:"Hyderabad", date:"08 Oct 2026", status:"Collection Scheduled", qty:2, stage:2, image:"/images/crutches_forearm.png" }
];
const listings = [
  {id:"RS-DEMO-04",name:"Underarm crutches · pair",category:"Crutches",price:900,location:"Vijayawada, Andhra Pradesh",desc:"Used demo example. A pair of underarm crutches.",image:"/images/crutches_underarm.png"},
  {id:"RS-DEMO-03",name:"Adjustable forearm crutches",category:"Crutches",price:1250,location:"Warangal, Telangana",desc:"Used demo example. Adjustable height.",image:"/images/crutches_forearm.png"},
  {id:"RS-DEMO-05",name:"Folding walking frame",category:"Walker",price:1800,location:"Hyderabad, Telangana",desc:"Basic folding walker example with hand grips.",image:"/images/walker_folding.png"},
  {id:"RS-DEMO-06",name:"Wheeled walker",category:"Walker",price:3200,location:"Mysuru, Karnataka",desc:"Wheeled mobility-aid example for the sample catalog.",image:"/images/walker_rollator.png"},
  {id:"RS-DEMO-02",name:"Transit wheelchair",category:"Wheelchair",price:6200,location:"Secunderabad, Telangana",desc:"Compact transit-style example with attendant handles.",image:"/images/wheelchair_transit.png"},
  {id:"RS-DEMO-01",name:"Folding manual wheelchair",category:"Wheelchair",price:8500,location:"Hyderabad, Telangana",desc:"Foldable manual frame; fit and condition need in-person review.",image:"/images/wheelchair_manual.png"}
];
const initialNotices = [
  {title:"Donation received",body:"Your sample donation DS-D-24018 is in the inspection queue.",time:"Today · 9:40 AM",unread:true},
  {title:"Collection detail",body:"DS-D-24012 shows an example collection window; no real pickup is booked.",time:"Yesterday",unread:true},
  {title:"A note on safety",body:"Devices must be inspected by authorized staff before any reuse.",time:"12 Oct",unread:false},
  {title:"Information reminder · sample",body:"A sample report is missing a collection landmark. This is illustrative; no reporter was contacted.",time:"11 Oct",unread:false}
];
const getNavItems = (t) => [
  ["donations", IconDonations, t.navDonations],
  ["inventory", IconInventory, t.navInventory],
  ["status", IconStatus, t.navStatus],
  ["purchase", IconPurchase, t.navPurchase],
  ["requests", IconNGO, t.navRequests],
  ["notifications", IconBell, t.navNotifications],
  ["resale", IconResale, t.navResale],
  ["profile", IconProfile, t.navProfile]
];
const navItems = [
  ["donations", IconDonations, "My donations"],
  ["inventory", IconInventory, "Device inventory"],
  ["status", IconStatus, "Item status"],
  ["purchase", IconPurchase, "Purchase donated items"],
  ["requests", IconNGO, "NGO requests"],
  ["notifications", IconBell, "Notifications"],
  ["resale", IconResale, "Resale items"],
  ["profile", IconProfile, "Profile settings"]
];
const STAGES = [
  {
    step: 1,
    title: "Donation Submitted",
    short: "Submitted",
    statusText: "Submission received · demo",
    desc: "Donor registered device details, condition report, and collection address.",
    detail: "Item specifications, condition report, and donor contact verified.",
    icon: "📝"
  },
  {
    step: 2,
    title: "Collection Scheduled",
    short: "Collection",
    statusText: "Collection Scheduled",
    desc: "Pickup window arranged with local volunteer or logistics coordinator.",
    detail: "Doorstep collection coordinated with district landmark confirmation.",
    icon: "🚚"
  },
  {
    step: 3,
    title: "Hub Intake & Verification",
    short: "Hub Intake",
    statusText: "Received at Hub",
    desc: "Device received at regional refurbishment center and barcoded.",
    detail: "Weight, serial number, and initial physical integrity verified.",
    icon: "📦"
  },
  {
    step: 4,
    title: "Technical Inspection",
    short: "Inspection",
    statusText: "Inspection Pending",
    desc: "Certified mobility technician performs comprehensive mechanical evaluation.",
    detail: "Frame stress test, wheel bearings, braking lock, and folding integrity.",
    icon: "🔍"
  },
  {
    step: 5,
    title: "Refurbishment & Sanitization",
    short: "Refurbishment",
    statusText: "Refurbishment in Progress",
    desc: "Repairs completed, worn parts renewed, deep hospital-grade sanitization.",
    detail: "Tire replacement, grip padding renewed, lubrication, and antimicrobial wash.",
    icon: "🛠️"
  },
  {
    step: 6,
    title: "Quality Certification",
    short: "Certification",
    statusText: "Quality Certified",
    desc: "Final load-bearing test passed; safety certification tag affixed.",
    detail: "Dual-technician sign-off certifying device meets mobility safety standards.",
    icon: "✅"
  },
  {
    step: 7,
    title: "Allocated & Delivered",
    short: "Allocated",
    statusText: "Allocated to Recipient",
    desc: "Matched to verified community NGO or direct beneficiary request.",
    detail: "Handover completed, custom fit verified, and mobility restored.",
    icon: "🤝"
  }
];

const DEVICE_TYPES = [
  {
    id: "wheelchairs",
    category: "Wheelchair",
    title: "Wheelchairs",
    image: "/images/wheelchair_manual.png",
    icon: IconWheelchair,
    badge: "Primary Mobility Aid",
    summary: "Seated mobility devices restoring personal independence, clinical transit, and outdoor travel.",
    description: "Built for individuals with significant lower-limb mobility impairment, spinal injuries, or bilateral amputations. Engineered for structural rigidity, ease of vehicle transit, and comfortable ergonomic seating.",
    variants: [
      { name: "Folding Manual Wheelchair", desc: "Dual cross-brace frame with self-propelling 24\" rear wheels and hand rims." },
      { name: "Transit Wheelchair", desc: "Lightweight compact frame with 8\" rear caster wheels and attendant handbrakes." },
      { name: "High-Back Reclining Wheelchair", desc: "Extended headrest with adjustable back angle for prolonged seated posture." }
    ],
    specs: [
      { label: "Weight Capacity", value: "100 – 125 kg" },
      { label: "Seat Width Options", value: "16\", 18\", 20\"" },
      { label: "Frame Material", value: "Mild steel / Aluminum alloy" },
      { label: "Wheel Type", value: "Solid puncture-proof PU" }
    ],
    checklist: [
      "Cross-brace weld integrity & frame alignment",
      "Dual rear-wheel parking brake locks",
      "Swing-away footrests & calf support straps",
      "Sanitized flame-retardant nylon upholstery"
    ]
  },
  {
    id: "crutches",
    category: "Crutches",
    title: "Crutches",
    image: "/images/crutches_forearm.png",
    icon: IconCrutches,
    badge: "Weight-Bearing Aid",
    summary: "Upper-body weight transfer supports for unilateral lower-limb injuries, post-surgery, or gait stability.",
    description: "Designed to shift body weight from an injured or affected leg to the torso and arms. Available in forearm elbow cuff and traditional axillary underarm configurations.",
    variants: [
      { name: "Adjustable Elbow / Forearm Crutches", desc: "Ergonomic molded arm cuff with contour grip and incremental height push-pins." },
      { name: "Axillary (Underarm) Crutches", desc: "Padded foam underarm rests with dual aluminum struts and center handgrips." },
      { name: "Ergonomic Spring-Tip Crutches", desc: "Shock-absorbing rubber suction ferrule reducing joint impact shock." }
    ],
    specs: [
      { label: "Height Range", value: "4'10\" – 6'2\" (147 – 188 cm)" },
      { label: "Weight Capacity", value: "100 – 115 kg per pair" },
      { label: "Adjustment", value: "Push-button (1\" increments)" },
      { label: "Tip Material", value: "Reinforced non-slip rubber" }
    ],
    checklist: [
      "Positive-locking brass push-button security",
      "Arm cuff pivot rivets and structural tubing",
      "Ferrule tread depth & internal steel washer",
      "Hypoallergenic sanitized grip padding"
    ]
  },
  {
    id: "walkers",
    category: "Walker",
    title: "Walkers",
    image: "/images/walker_folding.png",
    icon: IconWalker,
    badge: "Balance & Gait Support",
    summary: "Four-point wide base frames providing multi-directional balance for elderly mobility and neurological rehabilitation.",
    description: "Provides maximum stability for individuals experiencing general balance loss, Parkinson's disease, or gait unsteadiness. Wide stance allows confidence without requiring heavy wrist grip.",
    variants: [
      { name: "Standard Reciprocal Folding Walker", desc: "Articulated side frames enabling alternating reciprocal step-forward movement." },
      { name: "Two-Wheeled Walker", desc: "Front 5\" caster wheels for smooth stride glide with rear non-skid rubber feet." },
      { name: "Four-Wheel Rollator", desc: "Padded rest seat, shopping basket, and loop handbrakes for outdoor walking." }
    ],
    specs: [
      { label: "Weight Capacity", value: "110 – 135 kg" },
      { label: "Base Width", value: "23\" – 25\" (doorway fit)" },
      { label: "Folded Depth", value: "4 inches (trunk-friendly)" },
      { label: "Unit Weight", value: "2.4 – 3.8 kg lightweight alloy" }
    ],
    checklist: [
      "Center push-button folding latch rigidity",
      "Four-point rubber foot ferrule grip & traction",
      "Handle grip bonding & non-slip texture",
      "Wheel hub alignment and brake cable tension"
    ]
  }
];

const donatedStoreCatalog = [
  {
    id: "DON-BUY-01",
    donationId: "DS-D-24018",
    name: "Certified folding manual wheelchair",
    category: "Wheelchair",
    image: "/images/wheelchair_manual.png",
    handlingPrice: 1200,
    originalValue: 8500,
    condition: "Refurbished · Grade A",
    hub: "Hyderabad Regional Hub, Telangana",
    specs: "18\" seat width, dual rear parking brakes, fold-down footrests",
    cert: "Safety & Sanitization Certified",
    qtyAvailable: 2,
    donorNote: "Donated in Oct 2026; completely overhauled with new bearings and sanitized upholstery."
  },
  {
    id: "DON-BUY-02",
    donationId: "DS-D-24012",
    name: "Adjustable elbow crutches (pair)",
    category: "Crutches",
    image: "/images/crutches_forearm.png",
    handlingPrice: 350,
    originalValue: 1400,
    condition: "Refurbished · Grade A",
    hub: "Warangal Hub, Telangana",
    specs: "Lightweight aluminum, 10-step push-button height, ergonomic handgrips",
    cert: "Ferrule Grip Verified",
    qtyAvailable: 4,
    donorNote: "Donated in Oct 2026; new natural rubber anti-skid suction ferrules fitted."
  },
  {
    id: "DON-BUY-03",
    donationId: "DS-D-23994",
    name: "Reciprocal folding walker",
    category: "Walker",
    image: "/images/walker_folding.png",
    handlingPrice: 550,
    originalValue: 2200,
    condition: "Refurbished · Grade A",
    hub: "Vijayawada Hub, Andhra Pradesh",
    specs: "Side-folding trigger, 130 kg capacity, height adjustable 32\"–39\"",
    cert: "Hinge Rigidity Certified",
    qtyAvailable: 3,
    donorNote: "Donated gently used; lubricated hinges, sanitized grips, new rubber feet."
  },
  {
    id: "DON-BUY-04",
    donationId: "DS-D-23910",
    name: "Four-wheel rollator with seat & brakes",
    category: "Walker",
    image: "/images/walker_rollator.png",
    handlingPrice: 1100,
    originalValue: 4500,
    condition: "Refurbished · Grade A",
    hub: "Secunderabad Hub, Telangana",
    specs: "Padded rest seat, under-seat storage basket, dual loop handbrakes",
    cert: "Brake & Load Certified",
    qtyAvailable: 1,
    donorNote: "High stability rollator; brake cables tensioned, wheel alignment checked."
  },
  {
    id: "DON-BUY-05",
    donationId: "DS-D-23845",
    name: "Compact transit attendant wheelchair",
    category: "Wheelchair",
    image: "/images/wheelchair_transit.png",
    handlingPrice: 950,
    originalValue: 6200,
    condition: "Refurbished · Grade A",
    hub: "Hyderabad Regional Hub, Telangana",
    specs: "Foldable backrest, 8-inch rear casters, companion handbrakes",
    cert: "Sanitization & Brake Verified",
    qtyAvailable: 2,
    donorNote: "Lightweight travel wheelchair; thoroughly steam-sanitized."
  },
  {
    id: "DON-BUY-06",
    donationId: "DS-D-23801",
    name: "Underarm axillary crutches (pair)",
    category: "Crutches",
    image: "/images/crutches_underarm.png",
    handlingPrice: 280,
    originalValue: 1100,
    condition: "Refurbished · Grade A",
    hub: "Visakhapatnam Hub, Andhra Pradesh",
    specs: "Dual-strut aluminum frame, foam underarm pads, handgrip pins",
    cert: "Load Tested to 115 kg",
    qtyAvailable: 5,
    donorNote: "Brand new closed-cell foam pads and suction tips installed."
  }
];

const initialPurchases = [
  {
    id: "ORD-94812",
    deviceId: "DS-D-24018",
    name: "Refurbished folding manual wheelchair",
    category: "Wheelchair",
    price: 1200,
    paymentMethod: "UPI / Online Payment",
    date: "18 Oct 2026",
    status: "Dispatched from Hub",
    eta: "Tomorrow by 4:00 PM",
    trackingId: "TRACK-HYD-58291",
    recipient: "Ramesh Kumar",
    address: "Plot 42, Hitech City Road, Hyderabad, Telangana - 500081"
  }
];

const money = n => "₹" + Number(n).toLocaleString("en-IN");
const read = (key, fallback) => { try { const v=localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };

const defaultProfile = {
  name: "Suresh Kumar",
  email: "suresh.kumar@example.org",
  mobile: "+91 98490 54321",
  state: "Telangana",
  district: "Hyderabad",
  pin: "500034",
  type: "Donor",
  address: "Road No. 12, Banjara Hills"
};

export default function App() {
  const [profile,setProfile] = useState(()=>read("ds-profile",defaultProfile));
  const [isAuthenticated,setIsAuthenticated] = useState(()=>Boolean(read("ds-authenticated",false)));
  const [authMode,setAuthMode] = useState("signup");
  const [page,setPage] = useState("donations");
  const [devices,setDevices] = useState(()=>read("ds-devices",initialDevices));
  const [notices,setNotices] = useState(()=>read("ds-notices",initialNotices));
  const [search,setSearch] = useState("");
  const [toast,setToast] = useState("");
  const [modal,setModal] = useState("");
  const [editingDevice,setEditingDevice] = useState(null);
  const [category,setCategory] = useState("All categories");
  const [sort,setSort] = useState("Lowest price");
  const [statusFilter,setStatusFilter] = useState("All statuses");
  const [inventoryCondition,setInventoryCondition] = useState("All conditions");
  const [stageFilter,setStageFilter] = useState("All stages");
  const [deviceTypeFilter,setDeviceTypeFilter] = useState("All device types");
  const [purchases,setPurchases] = useState(()=>read("ds-purchases",initialPurchases));
  const [purchasingItem,setPurchasingItem] = useState(null);
  const [purchaseTab,setPurchaseTab] = useState("available");
  const [purchaseCategory,setPurchaseCategory] = useState("All categories");
  const [purchaseSearch,setPurchaseSearch] = useState("");
  const [language,setLanguage] = useState(()=>read("ds-language","English"));
  const [largeText,setLargeText] = useState(false);
  const [highContrast,setHighContrast] = useState(false);
  const [sidebarCollapsed,setSidebarCollapsed] = useState(()=>read("ds-sidebar-collapsed",false));

  useEffect(()=>{localStorage.setItem("ds-devices",JSON.stringify(devices));},[devices]);
  useEffect(()=>{localStorage.setItem("ds-notices",JSON.stringify(notices));},[notices]);
  useEffect(()=>{localStorage.setItem("ds-purchases",JSON.stringify(purchases));},[purchases]);
  useEffect(()=>{localStorage.setItem("ds-sidebar-collapsed",JSON.stringify(sidebarCollapsed));},[sidebarCollapsed]);
  useEffect(()=>{localStorage.setItem("ds-language",JSON.stringify(language));},[language]);
  useEffect(()=>{if(profile)localStorage.setItem("ds-profile",JSON.stringify(profile));else localStorage.removeItem("ds-profile");},[profile]);
  useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(""),2800);return ()=>clearTimeout(t);},[toast]);

  const t = useMemo(() => translations[language] || translations.English, [language]);
  const currentNavItems = useMemo(() => getNavItems(t), [t]);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    const msg = (translations[newLang] || translations.English).langChangedToast || `Language switched to ${newLang}`;
    setToast(msg);
  };

  const unread = notices.filter(n=>n.unread).length;
  const visibleListings = useMemo(()=>listings.filter(x=>(x.name+" "+x.category+" "+x.id+" "+x.location).toLowerCase().includes(search.toLowerCase())&&(category==="All categories"||x.category===category)).sort((a,b)=>sort==="Highest price"?b.price-a.price:a.price-b.price),[search,category,sort]);
  const visibleDonations = devices.filter(d=>(d.name+" "+d.id+" "+d.status).toLowerCase().includes(search.toLowerCase()));
  const filteredInventory = useMemo(() => devices.filter(d => 
    (category === "All categories" || d.category === category) &&
    (inventoryCondition === "All conditions" || d.condition === inventoryCondition) &&
    (stageFilter === "All stages" || String(d.stage) === String(stageFilter))
  ), [devices, category, inventoryCondition, stageFilter]);
  const visibleDeviceTypes = useMemo(() => DEVICE_TYPES.filter(t => 
    deviceTypeFilter === "All device types" || t.title === deviceTypeFilter || t.category === deviceTypeFilter
  ), [deviceTypeFilter]);
  const availablePurchases = useMemo(() => donatedStoreCatalog.filter(item => {
    const matchesCat = purchaseCategory === "All categories" || item.category === purchaseCategory;
    const matchesSearch = (item.name + " " + item.category + " " + item.hub + " " + item.donationId).toLowerCase().includes(purchaseSearch.toLowerCase());
    return matchesCat && matchesSearch;
  }), [purchaseCategory, purchaseSearch]);
  const title = currentNavItems.find(n=>n[0]===page)?.[2] || t.dashboard;
  const go = p => {setPage(p);setSearch("");setCategory("All categories");setStageFilter("All stages");setDeviceTypeFilter("All device types");setPurchaseCategory("All categories");setPurchaseSearch("");window.scrollTo({top:0,behavior:"smooth"});};

  function submitPurchase(e){
    e.preventDefault();
    if(!purchasingItem) return;
    const f = new FormData(e.currentTarget);
    const orderId = "ORD-" + Math.floor(10000 + Math.random() * 89999);
    const paymentMethod = String(f.get("paymentMethod") || "");
    const isFree = paymentMethod.includes("UDID");
    const trackingId = "TRACK-HYD-" + Math.floor(10000 + Math.random() * 89999);
    const price = isFree ? 0 : (purchasingItem.handlingPrice || 0);

    const newOrder = {
      id: orderId,
      deviceId: purchasingItem.donationId || purchasingItem.id,
      name: purchasingItem.name,
      category: purchasingItem.category,
      price,
      paymentMethod,
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      status: "Dispatched from Hub",
      eta: "Within 2-3 working days",
      trackingId,
      recipient: f.get("name"),
      address: `${f.get("address")}, ${f.get("district")}, ${f.get("state")} - ${f.get("pin")}`
    };

    setPurchases(prev => [newOrder, ...prev]);
    setNotices(prev => [{
      title: `Order confirmed: ${orderId}`,
      body: `Your request for "${purchasingItem.name}" has been placed. Tracking ID: ${trackingId}.`,
      time: "Just now",
      unread: true
    }, ...prev]);

    setPurchasingItem(null);
    setPurchaseTab("orders");
    setToast(`Order ${orderId} confirmed! Check 'My Orders' tab.`);
  }

  function updateDeviceStage(deviceId, newStage) {
    if (newStage < 1 || newStage > 7) return;
    const stageObj = STAGES.find(s => s.step === newStage);
    setDevices(prev => prev.map(d => {
      if (d.id !== deviceId) return d;
      return {
        ...d,
        stage: newStage,
        status: stageObj ? stageObj.statusText : d.status
      };
    }));
    setToast(`Stage updated to Step ${newStage}: ${stageObj?.title}`);
  }

  function submitSignup(e){
    e.preventDefault();
    const f=new FormData(e.currentTarget);
    const newProf = {
      name:f.get("name"),
      email:f.get("email"),
      mobile:f.get("mobile"),
      state:f.get("state"),
      district:f.get("district"),
      pin:f.get("pin"),
      type:f.get("type"),
      address:f.get("address")
    };
    setProfile(newProf);
    setIsAuthenticated(true);
    localStorage.setItem("ds-authenticated","true");
    setPage("donations");
    setToast(`Welcome to Divyang-Sahayak, ${newProf.name}!`);
  }

  function submitLogin(e){
    e.preventDefault();
    const f=new FormData(e.currentTarget);
    const loginId=f.get("loginId")||"suresh.kumar@example.org";
    const existing=read("ds-profile",null);
    const loggedProf = existing || {
      name: loginId.includes("@") ? (loginId.split("@")[0].replace("."," ")) : "Demo Donor",
      email: loginId.includes("@") ? loginId : "donor@example.org",
      mobile: !loginId.includes("@") ? loginId : "+91 98490 54321",
      state: "Telangana",
      district: "Hyderabad",
      pin: "500034",
      type: "Donor",
      address: "Road No. 12, Banjara Hills"
    };
    setProfile(loggedProf);
    setIsAuthenticated(true);
    localStorage.setItem("ds-authenticated","true");
    setPage("donations");
    setToast(`Welcome back, ${loggedProf.name}!`);
  }

  function quickLogin(role = "Donor"){
    const demoProf = {
      name: role === "Donor" ? "Suresh Kumar" : role === "NGO" ? "Sahaya Foundation" : "Ramesh Babu",
      email: "suresh.kumar@example.org",
      mobile: "+91 98490 54321",
      state: "Telangana",
      district: "Hyderabad",
      pin: "500034",
      type: role,
      address: "Road No. 12, Banjara Hills, Hyderabad"
    };
    setProfile(demoProf);
    setIsAuthenticated(true);
    localStorage.setItem("ds-authenticated","true");
    setPage("donations");
    setToast(`Logged in as ${demoProf.name} (${demoProf.type})`);
  }

  function enterAsGuest(){
    const guestProf = {
      name: "Guest Explorer",
      email: "guest@example.org",
      mobile: "+91 90000 00000",
      state: "Telangana",
      district: "Hyderabad",
      pin: "500001",
      type: "Donor",
      address: "Hyderabad Central"
    };
    setProfile(guestProf);
    setIsAuthenticated(true);
    localStorage.setItem("ds-authenticated","true");
    setPage("inventory");
    setToast("Exploring Divyang-Sahayak in Guest Mode.");
  }

  function handleLogout(){
    setIsAuthenticated(false);
    setProfile(defaultProfile);
    localStorage.removeItem("ds-authenticated");
    localStorage.removeItem("ds-profile");
    setAuthMode("login");
    setToast("You have been logged out.");
  }

  function submitProfile(e){e.preventDefault();const f=new FormData(e.currentTarget);setProfile(Object.fromEntries(["name","email","mobile","type","state","district","pin","address"].map(k=>[k,f.get(k)||""])));setToast("Profile saved in this browser.");}
  function submitDonation(e){e.preventDefault();const f=new FormData(e.currentTarget);const id="DS-D-"+Math.floor(10000+Math.random()*89999);const cat=f.get("category");const img=cat==="Crutches"?"/images/crutches_forearm.png":cat==="Walker"?"/images/walker_folding.png":"/images/wheelchair_manual.png";setDevices(prev=>[{id,name:f.get("name"),category:cat,condition:f.get("condition"),state:f.get("state"),district:f.get("district"),date:new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}),status:"Submission received · demo",qty:Number(f.get("qty")),stage:1,image:img},...prev]);setNotices(prev=>[{title:"Donation submitted · demo",body:`Your local demo donation ${id} has been saved in this browser. No pickup is booked.`,time:"Just now",unread:true},...prev]);setModal("");setPage("donations");setToast("Demo donation saved locally.");}
  function submitEditDonation(e){e.preventDefault();if(!editingDevice)return;const f=new FormData(e.currentTarget);const stageRaw=String(f.get("stage")||"");const stageNum=parseInt(stageRaw.split(" ")[0])||editingDevice.stage||1;const stageObj=STAGES.find(s=>s.step===stageNum);setDevices(prev=>prev.map(d=>{if(d.id!==editingDevice.id)return d;return {...d,name:f.get("name"),category:f.get("category"),condition:f.get("condition"),qty:Number(f.get("qty")),state:f.get("state"),district:f.get("district"),stage:stageNum,status:stageObj?stageObj.statusText:d.status};}));setToast(`Donation ${editingDevice.id} updated.`);setEditingDevice(null);}
  function deleteDonation(id,name){if(confirm(`Are you sure you want to delete donation "${name}" (${id})?`)){setDevices(prev=>prev.filter(d=>d.id!==id));setToast(`Donation ${id} deleted.`);}}
  function markAllRead(){setNotices(prev=>prev.map(n=>({...n,unread:false})));setToast("All demo notifications marked read.");}
  function resetDemo(){if(confirm("Reset local sample data?")){setDevices(initialDevices);setNotices(initialNotices);handleLogout();setToast("Sample data reset.");}}
  const badge=(text,kind="")=><span className={`badge ${kind}`}>{text}</span>;
  const pageHeader=(kicker,heading,sub,action=null)=><><div className="eyebrow">{kicker}</div><div className="heading-row"><div><h1>{heading}</h1><p className="sub">{sub}</p></div>{action}</div></>;
  const deviceDetails=d=><div className="device-detail" key={d.id}><div className="device-emoji">{d.category==="Crutches"?"♧":d.category==="Walker"?"♙":"♿"}</div><div className="device-body"><div className="line">{badge(d.id)} {badge(d.status,d.stage>=4?"gold":"green")}</div><h3>{d.name}</h3><p>{d.category} · {d.condition} · qty {d.qty} · {d.district}, {d.state}</p><div className="progress"><span style={{width:`${d.stage/7*100}%`}}/></div><small>Current demo status: {d.status} · {d.stage} of 7</small></div></div>;

  if (!isAuthenticated) {
    return (
      <div className={`standalone-auth-root ${largeText ? "large-text" : ""} ${highContrast ? "high-contrast" : ""}`}>
        <header className="standalone-auth-header">
          <div className="brand">
            <div className="logo"><IconWheelchair size={22} color="#ffffff" /></div>
            <div>
              <b>Divyang-Sahayak</b>
              <small>RESTORE DEVICES · RESTORE INDEPENDENCE</small>
            </div>
          </div>
          <div className="standalone-header-actions">
            <select value={language} onChange={e=>handleLanguageChange(e.target.value)}>
              <option value="English">English</option>
              <option value="తెలుగు">తెలుగు</option>
              <option value="हिन्दी">हिन्दी</option>
            </select>
            <button type="button" className="btn outline" onClick={enterAsGuest}>
              Explore as Guest →
            </button>
          </div>
        </header>

        <main className="standalone-auth-main">
          <div className="standalone-auth-card">
            <div className="standalone-auth-hero">
              <img 
                src="/images/auth_hero_lady.png" 
                alt="Smiling elderly lady in wheelchair" 
                className="standalone-auth-hero-bg" 
              />
              <div className="standalone-auth-hero-overlay"></div>
              <div className="standalone-auth-hero-content">
                <div className="auth-hero-badge">
                  <IconWheelchair size={15} /> <span>Restoring Mobility & Dignity</span>
                </div>
                <h2>Every device restored brings a smile back home.</h2>
                <p>A transparent, community-led platform connecting donors, mobility equipment, and beneficiaries across Telangana and Andhra Pradesh.</p>
                <div className="auth-hero-features">
                  <div className="hero-feature-item">
                    <span className="feature-check"><IconShieldCheck size={14} /></span>
                    <span>7-Stage Certified Inspection</span>
                  </div>
                  <div className="hero-feature-item">
                    <span className="feature-check"><IconCheck size={14} /></span>
                    <span>100% Free with UDID Card</span>
                  </div>
                  <div className="hero-feature-item">
                    <span className="feature-check"><IconTruck size={14} /></span>
                    <span>Doorstep Pickup & Hubs</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="standalone-auth-form-wrap">
              <div className="auth-tab-switch">
                <button 
                  type="button" 
                  className={`auth-tab-btn ${authMode === "signup" ? "active" : ""}`}
                  onClick={() => setAuthMode("signup")}
                >
                  Create Account / Sign Up
                </button>
                <button 
                  type="button" 
                  className={`auth-tab-btn ${authMode === "login" ? "active" : ""}`}
                  onClick={() => setAuthMode("login")}
                >
                  Sign In / Log In
                </button>
              </div>

              {authMode === "login" ? (
                <form className="auth-form" onSubmit={submitLogin}>
                  <div className="auth-form-head">
                    <h3>Welcome to Divyang-Sahayak</h3>
                    <p className="sub">Sign in to manage your donations, track items, or request mobility devices.</p>
                  </div>

                  <div className="quick-login-banner">
                    <span>Quick evaluator access:</span>
                    <button type="button" className="quick-login-btn" onClick={() => quickLogin("Donor")}>
                      <IconZap size={14} /> Instant Demo Login
                    </button>
                  </div>

                  <Field label="Email or Mobile Number *" name="loginId" required placeholder="you@example.com or +91 98490 00000" defaultValue="suresh.kumar@example.org" />
                  <Field label="Password *" name="password" required type="password" placeholder="Enter password" defaultValue="password123" />

                  <div className="form-row-between">
                    <label className="check" style={{margin:0}}>
                      <input type="checkbox" defaultChecked /> Remember me
                    </label>
                    <a className="forgot-link" onClick={() => setToast("Demo portal: enter any password or use Quick Demo Login.")}>Need help?</a>
                  </div>

                  <button type="submit" className="btn primary full" style={{marginTop:"14px", padding:"12px"}}>
                    Log In to Dashboard →
                  </button>

                  <div className="auth-switch-prompt">
                    Don't have an account yet?{" "}
                    <button type="button" className="link-button" onClick={() => setAuthMode("signup")}>
                      Sign up here
                    </button>
                  </div>
                </form>
              ) : (
                <form className="auth-form" onSubmit={submitSignup}>
                  <div className="auth-form-head">
                    <h3>Create your account</h3>
                    <p className="sub">Register as a Donor, Recipient, Volunteer, or NGO partner to share and track devices.</p>
                  </div>

                  <div className="form-grid">
                    <Field label="Full name *" name="name" required placeholder="e.g. Suresh Kumar" defaultValue={profile?.name || "Suresh Kumar"} />
                    <Field label="Email address *" name="email" required type="email" placeholder="you@example.com" defaultValue={profile?.email || "suresh.kumar@example.org"} />
                    <Field label="Mobile number *" name="mobile" required placeholder="+91 98000 00000" defaultValue={profile?.mobile || "+91 98490 54321"} />
                    <SelectField label="Account type" name="type" options={["Donor","Recipient / caregiver","NGO","Volunteer"]} defaultValue="Donor" />
                    <SelectField label="State *" name="state" options={["Telangana","Andhra Pradesh","Karnataka","Other"]} defaultValue="Telangana" />
                    <Field label="District *" name="district" required placeholder="e.g. Hyderabad" defaultValue={profile?.district || "Hyderabad"} />
                    <Field label="PIN code *" name="pin" required pattern="[0-9]{6}" maxLength="6" placeholder="6 digits" defaultValue={profile?.pin || "500034"} />
                    <Field label="Complete address *" name="address" required placeholder="Area, street and building" wide defaultValue={profile?.address || "Road No. 12, Banjara Hills"} />
                    <Field label="Password *" name="password" required type="password" minLength="6" placeholder="At least 6 characters" wide defaultValue="password123" />
                  </div>

                  <label className="check">
                    <input type="checkbox" required defaultChecked /> I understand this is a demo and agree to the platform guidelines.
                  </label>

                  <button type="submit" className="btn primary full" style={{marginTop:"10px", padding:"12px"}}>
                    Create Account & Enter Dashboard →
                  </button>

                  <div className="auth-switch-prompt">
                    Already have an account?{" "}
                    <button type="button" className="link-button" onClick={() => setAuthMode("login")}>
                      Log in here
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </main>

        {toast && <div className="toast" role="status">{toast}</div>}
      </div>
    );
  }

  return <div className={`app ${sidebarCollapsed ? "sidebar-is-collapsed" : ""} ${largeText?"large-text":""} ${highContrast?"high-contrast":""}`}>
    <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-head">
        <div className="brand" title={`${t.brandName}: ${t.brandSubtitle}`}>
          <div className="logo"><IconWheelchair size={17} color="#ffffff" /></div>
          {!sidebarCollapsed && (
            <div className="brand-text">
              <b>{t.brandName}</b>
              <small>{t.brandSubtitle}</small>
            </div>
          )}
        </div>
        <button 
          type="button" 
          className="sidebar-collapse-btn" 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <IconChevronRight size={13} /> : <IconChevronLeft size={13} />}
        </button>
      </div>

      <nav>
        {currentNavItems.map(([id, IconComp, label]) => (
          <button 
            key={id} 
            className={page === id ? "active" : ""} 
            onClick={() => go(id)}
            title={label}
          >
            <span className="nav-icon"><IconComp size={15} /></span>
            <span className="nav-label-text">{label}</span>
            {id === "notifications" && unread > 0 && <em>{unread}</em>}
          </button>
        ))}
      </nav>

      {/* User name with profile icon at bottom of sidebar */}
      <div 
        className={`user-mini ${page === "profile" ? "active" : ""}`}
        onClick={() => go("profile")}
        title={`${profile?.name || defaultProfile.name} (${t.navProfile})`}
        role="button"
        tabIndex={0}
      >
        <div className="avatar" title={t.navProfile}>
          <IconProfile size={14} />
        </div>
        {!sidebarCollapsed && (
          <>
            <div className="user-mini-info">
              <b>{profile?.name || defaultProfile.name}</b>
              <small>{profile?.type || "Donor"} · {t.activeStatus}</small>
            </div>
            <span className="user-mini-arrow">
              <IconChevronRight size={12} />
            </span>
          </>
        )}
      </div>
    </aside>
    <main className="main">
      <header className="topbar">
        <div className="topbar-left">
          <button 
            type="button" 
            className="sidebar-toggle-btn" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label="Toggle sidebar"
          >
            <IconMenu size={16} />
          </button>
          <div className="crumb">{title}<span> / {t.dashboard}</span></div>
        </div>
        <div className="top-actions">
          <div className="search-wrap">
            <IconSearch size={15} className="search-icon" />
            <input 
              className="global-search" 
              placeholder={t.searchPlaceholder} 
              value={search} 
              onChange={e=>setSearch(e.target.value)}
            />
          </div>
          <button onClick={()=>go("notifications")} aria-label="Notifications" title={t.navNotifications}>
            <IconBell size={16} /> {unread > 0 && <em>{unread}</em>}
          </button>
          <select value={language} onChange={e=>handleLanguageChange(e.target.value)} aria-label="Language">
            <option value="English">English</option>
            <option value="తెలుగు">తెలుగు</option>
            <option value="हिन्दी">हिन्दी</option>
          </select>
          <button type="button" className="btn logout-topbar-btn" onClick={handleLogout} title={t.logout}>
            <IconLogout size={15} /> {t.logout}
          </button>
        </div>
      </header>
      <section className="content">
        <div className="notice">ⓘ <b>Frontend demo only.</b> Records stay in this browser; no backend, database, real account, remote upload, or authorized inspection is connected.</div>

        {page==="donations"&&<>{pageHeader(t.donationsEyebrow,t.donationsTitle,t.donationsSub,<button className="btn primary" onClick={()=>setModal("donate")}><IconDonations size={15} style={{marginRight:"6px",verticalAlign:"middle"}} /> {t.donateDeviceBtn}</button>)}<div className="notice warning">These records are stored only in this browser. Collection statuses are illustrative; no pickup or inspection has been booked.</div><div className="panel"><div className="table-scroll"><table><thead><tr><th>DEVICE</th><th>DONATION ID</th><th>SUBMITTED</th><th>LOCATION</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>{visibleDonations.map(d=><tr key={d.id}><td><b>{d.name}</b><small>{d.category} · {d.condition} · qty {d.qty}</small></td><td>{d.id}</td><td>{d.date}</td><td>{d.district}, {d.state}</td><td>{badge(d.status,d.stage>=4?"gold":"green")}</td><td><div className="actions" style={{margin:0,gap:"6px"}}><button type="button" className="btn" style={{padding:"6px 10px",fontSize:"11px",display:"inline-flex",alignItems:"center",gap:"5px"}} onClick={()=>setEditingDevice(d)} title="Edit donation"><IconEdit size={12} /> {t.edit}</button><button type="button" className="btn danger" style={{padding:"6px 10px",fontSize:"11px",display:"inline-flex",alignItems:"center",gap:"5px"}} onClick={()=>deleteDonation(d.id, d.name)} title="Delete donation"><IconTrash size={12} /> {t.delete}</button></div></td></tr>)}</tbody></table>{!visibleDonations.length&&<p className="empty">No donations match your search.</p>}</div></div></>}

        {page==="status"&&<>{pageHeader(t.statusEyebrow,t.statusTitle,t.statusSub)}
          <div className="notice warning">Statuses are browser-local examples, not live collection, inspection, repair, allocation or distribution updates.</div>
          <div className="toolbar">
            <label>{t.filterStatus}
              <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
                <option>{t.allStatuses}</option>
                {[...new Set(devices.map(d=>d.status))].map(s=><option key={s}>{s}</option>)}
              </select>
            </label>
          </div>
          <div className="timeline-container">
            {devices.filter(d=>statusFilter==="All statuses"||statusFilter===t.allStatuses||d.status===statusFilter).map(d => (
              <DeviceTimeline 
                key={d.id} 
                device={d} 
                onUpdateStage={updateDeviceStage} 
              />
            ))}
            {!devices.filter(d=>statusFilter==="All statuses"||statusFilter===t.allStatuses||d.status===statusFilter).length && (
              <p className="panel empty">No items match your status filter.</p>
            )}
          </div>
        </>}

        {page==="inventory"&&<>{pageHeader(t.inventoryEyebrow,t.inventoryTitle,t.inventorySub)}
          <div className="notice">ⓘ <b>Device Types Directory:</b> Overview of supported assistive equipment types — Walkers, Wheelchairs, and Crutches — including model types, technical specifications, and safety inspection criteria.</div>

          <div className="toolbar">
            <label>{t.filterItemType}
              <select value={deviceTypeFilter} onChange={e=>setDeviceTypeFilter(e.target.value)}>
                <option>{t.allDeviceTypes}</option>
                <option value="Wheelchairs">{t.wheelchairs}</option>
                <option value="Crutches">{t.crutches}</option>
                <option value="Walkers">{t.walkers}</option>
              </select>
            </label>
            <div style={{marginLeft:"auto", display:"flex", alignItems:"center", gap:"10px"}}>
              <span className="badge green">{visibleDeviceTypes.length} supported categories</span>
              <button className="btn" onClick={()=>go("status")}><IconStatus size={14} style={{marginRight:"6px",verticalAlign:"middle"}} /> View Lifecycle in Item status →</button>
            </div>
          </div>

          <div className="device-types-grid">
            {visibleDeviceTypes.map(type => {
              const inStock = devices.filter(d => d.category.toLowerCase().includes(type.category.toLowerCase())).reduce((acc, curr) => acc + (Number(curr.qty) || 1), 0);
              const IconComp = typeof type.icon === "function" ? type.icon : IconWheelchair;
              return (
                <div className="device-type-card" key={type.id}>
                  <div className="type-card-header">
                    <div className="type-header-left">
                      <div className="device-emoji"><IconComp size={24} /></div>
                      <div>
                        <h3>{type.title}</h3>
                        <span className="badge gold">{type.badge}</span>
                      </div>
                    </div>
                  </div>

                  <div className="type-card-image-wrap">
                    <img src={type.image} alt={type.title} className="type-card-img" onError={(e)=>{e.target.style.display="none";}} />
                  </div>

                  <div className="type-counter-badge">
                    📦 <b>{inStock}</b> unit{inStock === 1 ? "" : "s"} tracked in system
                  </div>

                  <p className="type-card-summary">{type.summary}</p>
                  <p className="type-card-desc">{type.description}</p>

                  <div className="type-section-title">Common Models & Types</div>
                  <div className="type-variants-list">
                    {type.variants.map((v, i) => (
                      <div className="variant-item" key={i}>
                        <b>{v.name}</b>
                        <span>{v.desc}</span>
                      </div>
                    ))}
                  </div>

                  <div className="type-section-title">Technical Specifications</div>
                  <div className="type-specs-grid">
                    {type.specs.map((s, i) => (
                      <div className="spec-cell" key={i}>
                        <small>{s.label}</small>
                        <span>{s.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="type-section-title">Safety & Refurbishment Criteria</div>
                  <ul className="type-checklist">
                    {type.checklist.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>

                  <div className="type-card-actions">
                    <button className="btn primary" onClick={() => setModal("donate")}>
                      ♡ Donate {type.title}
                    </button>
                    <button className="btn" onClick={() => go("status")}>
                      Track in Item status →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>}

        {page==="purchase"&&<>{pageHeader(t.purchaseEyebrow,t.purchaseTitle,t.purchaseSub)}
          <div className="notice">ⓘ <b>Community Subsidized Store:</b> Donated items are provided at minimal refurbishment & sanitization handling charges, or <b>{t.freeWithUdid}</b>.</div>

          <div className="purchase-tabs">
            <button 
              type="button"
              className={`purchase-tab-btn ${purchaseTab==="available"?"active":""}`} 
              onClick={()=>setPurchaseTab("available")}
            >
              🏷 {t.availableItemsTab} ({availablePurchases.length})
            </button>
            <button 
              type="button"
              className={`purchase-tab-btn ${purchaseTab==="orders"?"active":""}`} 
              onClick={()=>setPurchaseTab("orders")}
            >
              📦 {t.purchasedOrdersTab} ({purchases.length})
            </button>
          </div>

          {purchaseTab==="available"&&<>
            <div className="toolbar">
              <label>{t.filterCategory}
                <select value={purchaseCategory} onChange={e=>setPurchaseCategory(e.target.value)}>
                  <option>{t.allCategories}</option>
                  <option value="Wheelchair">{t.wheelchair}</option>
                  <option value="Crutches">{t.crutches}</option>
                  <option value="Walker">{t.walker}</option>
                </select>
              </label>
              <div style={{flex:1, minWidth:"200px"}}>
                <input 
                  placeholder="⌕ Search donated items, models, hubs…" 
                  value={purchaseSearch} 
                  onChange={e=>setPurchaseSearch(e.target.value)} 
                />
              </div>
            </div>

            <div className="purchase-grid">
              {availablePurchases.map(item => (
                <article className="purchase-card" key={item.id}>
                  <div className="purchase-card-img-wrap">
                    <img src={item.image} alt={item.name} className="purchase-card-img" onError={(e)=>{e.target.style.display="none";}} />
                  </div>

                  <div className="purchase-card-top">
                    <div className="device-emoji">
                      {item.category==="Crutches"?<IconCrutches size={22}/>:item.category==="Walker"?<IconWalker size={22}/>:<IconWheelchair size={22}/>}
                    </div>
                    <span className="badge green"><IconShieldCheck size={12} style={{marginRight:"4px",verticalAlign:"middle"}} />{item.cert}</span>
                  </div>

                  <div className="purchase-donor-tag">
                    <span>From Donation: <b>{item.donationId}</b></span>
                    <span>·</span>
                    <span className="badge">{item.condition}</span>
                  </div>

                  <h3>{item.name}</h3>
                  <div className="purchase-specs">{item.specs}</div>
                  <div className="purchase-donor-note">“{item.donorNote}”</div>
                  <small style={{color:"#80938e", display:"block", marginBottom:"10px"}}>📍 Dispatch Hub: {item.hub}</small>

                  <div className="purchase-price-box">
                    <div className="price-main-row">
                      <span className="price-amount">{money(item.handlingPrice)}</span>
                      <span className="price-original">{money(item.originalValue)}</span>
                      <span className="badge gold">Save {Math.round((1 - item.handlingPrice/item.originalValue)*100)}%</span>
                    </div>
                    <span className="price-subsidy-note">✓ Or ₹0 {t.freeWithUdid}</span>
                  </div>

                  <button 
                    type="button" 
                    className="btn primary full" 
                    onClick={()=>setPurchasingItem(item)}
                  >
                    <IconPurchase size={16} style={{marginRight:"6px",verticalAlign:"middle"}} /> {t.buyClaimDevice}
                  </button>
                </article>
              ))}
              {!availablePurchases.length&&<p className="panel empty" style={{gridColumn:"1/-1"}}>No donated items match your search.</p>}
            </div>
          </>}

          {purchaseTab==="orders"&&<div className="orders-list">
            {purchases.map(ord => (
              <div className="order-card" key={ord.id}>
                <div className="order-card-main">
                  <div className="line" style={{marginBottom:"6px"}}>
                    <span className="badge">{ord.id}</span>
                    <span className="badge green">{ord.status}</span>
                    <span className="badge">{ord.category}</span>
                  </div>
                  <h3>{ord.name}</h3>
                  <p style={{margin:"4px 0", fontSize:"12px", color:"#596f6a"}}>
                    <strong>Recipient:</strong> {ord.recipient} · <strong>Ordered on:</strong> {ord.date}
                  </p>
                  <p style={{margin:"4px 0", fontSize:"12px", color:"#596f6a"}}>
                    <strong>Delivery Address:</strong> {ord.address}
                  </p>
                  <p style={{margin:"4px 0", fontSize:"12px", color:"#596f6a"}}>
                    <strong>Payment Method:</strong> {ord.paymentMethod} · <strong>Amount Paid:</strong> {money(ord.price)}
                  </p>
                </div>
                <div className="order-card-meta">
                  <div>
                    <small style={{display:"block", color:"#899b96", marginBottom:"4px"}}>TRACKING ID</small>
                    <span className="order-track-id">{ord.trackingId}</span>
                  </div>
                  <div style={{textAlign:"right", marginTop:"12px"}}>
                    <small style={{color:"#0d796e", fontWeight:"700", display:"block"}}>Estimated Delivery</small>
                    <b style={{fontSize:"13px"}}>{ord.eta}</b>
                  </div>
                </div>
              </div>
            ))}
            {!purchases.length&&<p className="panel empty">No purchase orders placed yet.</p>}
          </div>}
        </>}

        {page==="requests"&&<>{pageHeader(t.requestsEyebrow,t.requestsTitle,t.requestsSub,<button className="btn primary" onClick={()=>setModal("request")}><IconNGO size={15} style={{marginRight:"6px",verticalAlign:"middle"}} /> Request equipment</button>)}<div className="notice warning">All NGO names, verification labels, requests and allocations are illustrative. This frontend cannot verify organizations or allocate equipment.</div><div className="split"><div className="panel"><div className="eyebrow">ORGANIZATION PROFILE</div><h3>Sahaya Community Centre (sample)</h3><p>Service area · Hyderabad, Telangana · sample</p><p>Contact: Not connected in demo mode</p>{badge("Demo verification label","gold")}<h3 className="section-gap">Equipment availability</h3><p className="sub">Illustrative examples only — no device is actually available for allocation.</p>{["Mobility support for community visitors","Support for home mobility"].map((x,i)=><div className="request-row" key={x}><div><b>{x}</b><p>{i?"Crutches · quantity 3":"Wheelchair · quantity 2"} · Hyderabad</p>{badge("Pending review · demo","gold")}</div><button className="btn" onClick={e=>{e.currentTarget.textContent="Reviewed (demo)";e.currentTarget.disabled=true;setToast("Demo only: request marked reviewed.");}}>Mark reviewed</button></div>)}</div><div className="panel"><h3>Beneficiary privacy</h3><p>Use district-level location. Do not show exact home addresses or private contact details publicly.</p><hr/><h3>Allocation stages</h3><div className="badge-wrap">{["Request submitted","Review","Match","Distribution follow-up"].map(x=>badge(x))}</div><p className="sub">No allocation or distribution is being made by this demo.</p></div></div></>}

        {page==="notifications"&&<>{pageHeader(t.notificationsEyebrow,t.notificationsTitle,t.notificationsSub,<button className="btn" onClick={markAllRead}><IconCheck size={14} style={{marginRight:"4px",verticalAlign:"middle"}} /> Mark all read</button>)}<div className="notice">These notices are local demo messages. Email and remote push notifications are not configured.</div><div className="panel">{notices.map((n,i)=><div className="notification" key={i}><div className="device-emoji small"><IconBell size={18} /></div><div className="notification-body"><div className="line"><b>{n.title}</b>{n.unread&&badge("Unread","green")}</div><p>{n.body}</p><small>{n.time}</small></div>{n.unread&&<button className="btn" onClick={()=>setNotices(prev=>prev.map((x,j)=>j===i?{...x,unread:false}:x))}><IconCheck size={13} style={{marginRight:"4px",verticalAlign:"middle"}} /> Read</button>}</div>)}</div></>}

        {page==="resale"&&<>{pageHeader(t.resaleEyebrow,t.resaleTitle,t.resaleSub)}<div className="notice warning">These are fictional demo listings and sample prices, not live offers or confirmed stock. No seller is connected; there is no payment, order or checkout. Devices must be checked by an authorized professional before use.</div><div className="panel filters"><div><input placeholder={t.searchPlaceholder} value={search} onChange={e=>setSearch(e.target.value)}/><small>{visibleListings.length} illustrative listings</small></div><label>{t.filterCategory}<select value={category} onChange={e=>setCategory(e.target.value)}>{[t.allCategories,"Wheelchair","Crutches","Walker"].map(x=><option key={x}>{x}</option>)}</select></label><label>Sort by price<select value={sort} onChange={e=>setSort(e.target.value)}><option>Lowest price</option><option>Highest price</option></select></label></div><div className="cards">{visibleListings.map(i=><article className="listing" key={i.id}><div className="listing-card-img-wrap"><img src={i.image} alt={i.name} className="listing-card-img" onError={(e)=>{e.target.style.display="none";}} /></div><div className="listing-top"><div className="device-emoji">{i.category==="Crutches"?<IconCrutches size={22}/>:i.category==="Walker"?<IconWalker size={22}/>:<IconWheelchair size={22}/>}</div>{badge("● Sample listing","gold")}</div><div className="eyebrow">{i.category.toUpperCase()} · {i.id}</div><h3>{i.name}</h3><div className="price">{money(i.price)} <small>illustrative price</small></div><p>{badge("Used · demo example")} <span className="muted">{i.location}</span></p><p className="desc">{i.desc}</p><div className="actions"><button className="btn" onClick={()=>setToast(`${i.name}: fictional sample listing; no seller is connected.`)}>{t.viewDetails}</button><button className="btn primary" onClick={()=>setToast("Interest preview only. No seller will be contacted.")}>Preview interest</button></div></article>)}</div></>}

        {page==="profile"&&<>{pageHeader(t.profileEyebrow,t.profileTitle,t.profileSub)}<div className="notice warning">Profile fields are stored in this browser only. There is no account system, verification or real account deletion.</div><div className="profile-layout"><form className="panel" onSubmit={submitProfile}><h3>{t.personalDetails}</h3><p className="sub">Use sample information; avoid sensitive details.</p><div className="form-grid"><Field label={t.fullName} name="name" required defaultValue={profile?.name||""}/><Field label={t.email} name="email" type="email" required defaultValue={profile?.email||""}/><Field label={t.mobile} name="mobile" defaultValue={profile?.mobile||""}/><SelectField label={t.accountType} name="type" options={["Donor","NGO","Recipient / caregiver","Volunteer"]} defaultValue={profile?.type||"Donor"}/><SelectField label={t.state} name="state" options={["Telangana","Andhra Pradesh","Karnataka","Other"]} defaultValue={profile?.state||"Telangana"}/><Field label={t.district} name="district" defaultValue={profile?.district||""}/><Field label={t.pinCode} name="pin" pattern="[0-9]{6}" maxLength="6" defaultValue={profile?.pin||""}/><Field label={t.address} name="address" wide defaultValue={profile?.address||""}/></div><div className="actions"><button className="btn primary"><IconCheck size={14} style={{marginRight:"4px",verticalAlign:"middle"}} /> {t.saveInBrowser}</button><button type="button" className="btn danger" onClick={handleLogout}><IconLogout size={14} style={{marginRight:"4px",verticalAlign:"middle"}} /> {t.logout}</button></div></form><div><div className="panel"><h3>{t.accountAndSecurity}</h3><p>{t.role}: {profile?.type||"Donor"}</p>{badge("Not verified","gold")}<p className="sub">Password reset and authentication are not connected.</p><button className="btn" onClick={()=>setToast("Password reset is not connected in this frontend demo.")}>Password reset demo</button></div><div className="panel"><h3>{t.dataManagement}</h3><p className="sub">Reset illustrative donation, report and notification data.</p><div className="actions"><button className="btn" onClick={resetDemo}>↻ Reset sample data</button><button className="btn danger" onClick={()=>{if(confirm("Clear demo profile and local data?")){setProfile(null);setDevices(initialDevices);setNotices([]);localStorage.removeItem("ds-profile");localStorage.removeItem("ds-devices");localStorage.removeItem("ds-notices");setToast("Local demo data cleared.");}}}>Request demo deletion</button></div></div><div className="panel"><h3>{t.languageAndAccessibility}</h3><label>Language<select value={language} onChange={e=>handleLanguageChange(e.target.value)}><option value="English">English</option><option value="తెలుగు">తెలుగు</option><option value="हिन्दी">हिन्दी</option></select></label><label className="check"><input type="checkbox" checked={largeText} onChange={e=>setLargeText(e.target.checked)}/> {t.largerText}</label><label className="check"><input type="checkbox" checked={highContrast} onChange={e=>setHighContrast(e.target.checked)}/> {t.higherContrast}</label></div></div></div></>}
        <footer className="footer"><span>About</span><span>How it works</span><span>Contact</span><span>FAQs</span><span>Privacy</span><span>Terms</span><span>Accessibility</span><span>Report an issue</span></footer>
      </section>
    </main>
    {modal==="donate"&&<Modal title="Donate a device" close={()=>setModal("")}><form onSubmit={submitDonation}><div className="notice warning">Demo only: this creates a browser-local record and does not book collection or inspection.</div><div className="form-grid"><Field label="Device name *" name="name" required placeholder="e.g. Manual wheelchair"/><SelectField label="Category" name="category" options={["Wheelchair","Crutches","Walker","Other"]}/><SelectField label="Condition" name="condition" options={["Working","Repairable","Needs inspection"]}/><Field label="Quantity *" name="qty" type="number" min="1" required defaultValue="1"/><SelectField label="State" name="state" options={["Telangana","Andhra Pradesh","Karnataka","Other"]}/><Field label="District *" name="district" required placeholder="District"/></div><div className="actions"><button className="btn primary"><IconDonations size={15} style={{marginRight:"6px",verticalAlign:"middle"}} /> Save demo donation</button><button type="button" className="btn" onClick={()=>setModal("")}>Cancel</button></div></form></Modal>}
    {modal==="request"&&<Modal title="Request equipment" close={()=>setModal("")}><form onSubmit={e=>{e.preventDefault();setModal("");setToast("Request preview saved for this screen only; no organization was contacted.");}}><div className="notice warning">Demo only. This request is not sent to an NGO.</div><Field label="Organization name *" name="org" required/><SelectField label="Equipment needed" name="equipment" options={["Wheelchair","Crutches","Walker"]}/><Field label="Quantity *" name="qty" type="number" min="1" required defaultValue="1"/><Field label="District *" name="district" required/><button className="btn primary"><IconNGO size={15} style={{marginRight:"6px",verticalAlign:"middle"}} /> Save demo request</button></form></Modal>}
    {editingDevice&&<Modal title={`Edit donation: ${editingDevice.id}`} close={()=>setEditingDevice(null)}><form onSubmit={submitEditDonation}><div className="notice">Editing donation record <b>{editingDevice.id}</b>. Changes are saved in your browser.</div><div className="form-grid"><Field label="Device name *" name="name" required defaultValue={editingDevice.name}/><SelectField label="Category" name="category" options={["Wheelchair","Crutches","Walker","Other"]} defaultValue={editingDevice.category}/><SelectField label="Condition" name="condition" options={["Working","Repairable","Needs inspection"]} defaultValue={editingDevice.condition}/><Field label="Quantity *" name="qty" type="number" min="1" required defaultValue={editingDevice.qty}/><SelectField label="State" name="state" options={["Telangana","Andhra Pradesh","Karnataka","Other"]} defaultValue={editingDevice.state}/><Field label="District *" name="district" required defaultValue={editingDevice.district}/><SelectField label="Lifecycle Stage" name="stage" options={STAGES.map(s=>`${s.step} - ${s.title}`)} defaultValue={`${editingDevice.stage||1} - ${STAGES.find(s=>s.step===(editingDevice.stage||1))?.title||""}`} wide/></div><div className="actions"><button className="btn primary"><IconCheck size={15} style={{marginRight:"6px",verticalAlign:"middle"}} /> Save changes</button><button type="button" className="btn" onClick={()=>setEditingDevice(null)}>Cancel</button></div></form></Modal>}
    {purchasingItem&&<Modal title={`Purchase / Claim: ${purchasingItem.name}`} close={()=>setPurchasingItem(null)}><form onSubmit={submitPurchase}><div className="notice"><b>Donation Origin:</b> {purchasingItem.donationId} · Refurbished & certified at {purchasingItem.hub}.</div><div className="form-grid"><Field label="Recipient Full Name *" name="name" required placeholder="Full name" defaultValue={profile?.name}/><Field label="Mobile Number *" name="mobile" required placeholder="+91 90000 00000" defaultValue={profile?.mobile}/><SelectField label="State *" name="state" options={["Telangana","Andhra Pradesh","Karnataka","Other"]} defaultValue={profile?.state||"Telangana"}/><Field label="District *" name="district" required placeholder="District" defaultValue={profile?.district}/><Field label="PIN Code *" name="pin" required pattern="[0-9]{6}" maxLength="6" placeholder="6 digits" defaultValue={profile?.pin}/><SelectField label="Payment / Subsidy Mode *" name="paymentMethod" options={[`Subsidized handling fee (${money(purchasingItem.handlingPrice)} via UPI / Netbanking)`,"100% Free with UDID Disability Certificate",`Cash on Delivery upon physical inspection (${money(purchasingItem.handlingPrice)})`]} wide/><Field label="UDID Disability Card No. (if claiming 100% free)" name="udid" placeholder="e.g. TG12345678901234" wide/><Field label="Complete Delivery Address *" name="address" required placeholder="House/Flat, street, landmark" wide defaultValue={profile?.address}/></div><div className="actions"><button className="btn primary">Confirm purchase order →</button><button type="button" className="btn" onClick={()=>setPurchasingItem(null)}>Cancel</button></div></form></Modal>}
    {toast&&<div className="toast" role="status">{toast}</div>}
  </div>;
}
function Field({label,name,wide=false,...props}){return <label className={`field ${wide?"wide":""}`}>{label}<input name={name} {...props}/></label>}
function SelectField({label,name,options,wide=false,defaultValue}){return <label className={`field ${wide?"wide":""}`}>{label}<select name={name} defaultValue={defaultValue||options[0]}>{options.map(o=><option key={o}>{o}</option>)}</select></label>}
function Modal({title,close,children}){return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)close();}}><div className="modal"><div className="modal-title"><h2>{title}</h2><button className="btn" onClick={close} type="button">✕</button></div>{children}</div></div>}

function DeviceTimeline({ device, onUpdateStage }) {
  const currentStage = Number(device.stage) || 1;

  return (
    <div className="device-timeline-wrapper" key={device.id}>
      <div className="timeline-header-card">
        <div className="timeline-device-main">
          <img 
            src={device.image || (device.category === "Crutches" ? "/images/crutches_forearm.png" : device.category === "Walker" ? "/images/walker_folding.png" : "/images/wheelchair_manual.png")} 
            alt={device.name} 
            className="device-thumb-img" 
            onError={(e)=>{e.target.style.display="none";}} 
          />
          <div className="timeline-device-title">
            <div className="line">
              <span className="badge">{device.id}</span>
              <span className={`badge ${currentStage >= 6 ? "green" : currentStage >= 4 ? "gold" : ""}`}>
                {device.status}
              </span>
              <span className="badge">Stage {currentStage} of 7</span>
            </div>
            <h3>{device.name}</h3>
            <p className="timeline-meta">
              <span><strong>Category:</strong> {device.category}</span>
              <span><strong>Condition:</strong> {device.condition}</span>
              <span><strong>Quantity:</strong> {device.qty}</span>
              <span><strong>Location:</strong> {device.district}, {device.state}</span>
              <span><strong>Submitted:</strong> {device.date}</span>
            </p>
          </div>
        </div>

        <div className="timeline-stage-controls">
          <button 
            type="button"
            className="btn" 
            disabled={currentStage <= 1}
            onClick={() => onUpdateStage(device.id, currentStage - 1)}
            title="Step back to previous stage"
          >
            ← Previous stage
          </button>
          <button 
            type="button"
            className="btn primary" 
            disabled={currentStage >= 7}
            onClick={() => onUpdateStage(device.id, currentStage + 1)}
            title="Advance to next stage"
          >
            Advance stage →
          </button>
        </div>
      </div>

      {/* Horizontal Pipeline Stepper */}
      <div className="stepper-bar-container">
        <div className="stepper-track">
          {STAGES.map((s) => {
            const isCompleted = s.step < currentStage;
            const isCurrent = s.step === currentStage;
            const isPending = s.step > currentStage;
            return (
              <div 
                key={s.step} 
                className={`stepper-node ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""} ${isPending ? "pending" : ""}`}
                onClick={() => onUpdateStage(device.id, s.step)}
                title={`Jump directly to Step ${s.step}: ${s.title}`}
              >
                <div className="stepper-dot">
                  {isCompleted ? "✓" : s.step}
                </div>
                <div className="stepper-label">{s.short}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vertical Timeline Flow */}
      <div className="timeline-vertical-flow">
        <div className="timeline-vertical-spine" />
        {STAGES.map((stage) => {
          const isCompleted = stage.step < currentStage;
          const isCurrent = stage.step === currentStage;
          const isPending = stage.step > currentStage;

          return (
            <div 
              key={stage.step} 
              className={`timeline-entry ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""} ${isPending ? "pending" : ""}`}
              onClick={() => onUpdateStage(device.id, stage.step)}
              title={`Click to set stage to: ${stage.title}`}
            >
              <div className="timeline-marker">
                <div className="marker-icon">
                  {isCompleted ? "✓" : isCurrent ? "●" : stage.step}
                </div>
              </div>
              <div className="timeline-content-bubble">
                <div className="bubble-top">
                  <div>
                    <span className="bubble-step-tag">Stage {stage.step} of 7</span>
                    <h4 className="bubble-title">{stage.icon} {stage.title}</h4>
                  </div>
                  <span className={`badge ${isCompleted ? "green" : isCurrent ? "gold" : ""}`}>
                    {isCompleted ? "✓ Completed" : isCurrent ? "▶ Current Stage" : "Upcoming"}
                  </span>
                </div>
                <p className="bubble-desc">{stage.desc}</p>
                <div className="bubble-detail">
                  <small>ⓘ {stage.detail}</small>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
