import { 
  User, MapPin, Mail, Phone, Tag, Flag, 
  FolderOpen, UserCheck, Calendar, Clock,
  Building2, Globe, Briefcase, Award,
  X, Download, Share2, Edit3, Trash2,
  CheckCircle, AlertCircle, HelpCircle
} from "lucide-react";

export default function LeadDetail({ lead, onClose }) {
  if (!lead) return null;

  const getStatusColor = (status) => {
    const colors = {
      new: "bg-blue-100 text-blue-700 border-blue-200",
      contacted: "bg-yellow-100 text-yellow-700 border-yellow-200",
      negotiation: "bg-purple-100 text-purple-700 border-purple-200",
      converted: "bg-green-100 text-green-700 border-green-200",
      lost: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-green-100 text-green-700 border-green-200",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
      high: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[priority] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const formatDate = (date) => {
    if (!date) return "Non renseigné";
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const infoSections = [
    {
      title: "Informations personnelles",
      icon: User,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      fields: [
        { label: "Nom complet", value: lead.name, icon: User, color: "text-blue-500" },
        { label: "Ville", value: lead.city, icon: MapPin, color: "text-green-500" },
        { label: "Contact", value: lead.contact_name, icon: UserCheck, color: "text-purple-500" },
      ]
    },
    {
      title: "Coordonnées",
      icon: Mail,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      fields: [
        { label: "Email", value: lead.contact_email, icon: Mail, color: "text-indigo-500" },
        { label: "Téléphone", value: lead.contact_phone, icon: Phone, color: "text-green-500" },
      ]
    },
    {
      title: "Suivi & Gestion",
      icon: Tag,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      fields: [
        { 
          label: "Statut", 
          value: lead.status, 
          icon: Tag, 
          color: "text-purple-500",
          badge: true,
          badgeColor: getStatusColor(lead.status)
        },
        { 
          label: "Priorité", 
          value: lead.priority, 
          icon: Flag, 
          color: "text-red-500",
          badge: true,
          badgeColor: getPriorityColor(lead.priority)
        },
        { label: "Source", value: lead.source?.name, icon: Globe, color: "text-cyan-500" },
        { label: "Catégorie", value: lead.category?.name, icon: FolderOpen, color: "text-yellow-500" },
        { label: "Assigné à", value: lead.assignedTo?.nom, icon: User, color: "text-pink-500" },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl animate-slideUp">
        
        {/* Header avec gradient et actions */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    {lead.name || "Lead sans nom"}
                  </h2>
                  <p className="text-blue-100 text-sm mt-1">
                    ID: #{lead.id || "N/A"} • Créé le {formatDate(lead.created_at)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-105">
                <Edit3 className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-105">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-105">
                <Download className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg bg-white/10 hover:bg-red-500/30 transition-all duration-200 hover:scale-105">
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-105 ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Corps avec sections organisées */}
        <div className="p-8 space-y-8">
          {infoSections.map((section, idx) => (
            <div key={idx} className="animate-slideIn" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-gray-100">
                <div className={`p-2 rounded-xl ${section.bgColor}`}>
                  <section.icon className={`w-5 h-5 ${section.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
                <div className="flex-1"></div>
                <span className="text-xs text-gray-400">{section.fields.length} informations</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.fields.map((field, fieldIdx) => {
                  const IconComponent = field.icon;
                  const displayValue = field.value || "Non renseigné";
                  const isPlaceholder = !field.value;
                  
                  return (
                    <div 
                      key={fieldIdx}
                      className="group relative rounded-xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:shadow-lg hover:border-gray-300 hover:scale-[1.02]"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${isPlaceholder ? 'bg-gray-100' : 'bg-gray-50'} group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-indigo-50 transition-all duration-300`}>
                          <IconComponent className={`w-4 h-4 ${isPlaceholder ? 'text-gray-400' : field.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                            {field.label}
                          </p>
                          {field.badge ? (
                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium border ${field.badgeColor}`}>
                              {displayValue === "new" ? "Nouveau" :
                               displayValue === "contacted" ? "Contacté" :
                               displayValue === "negotiation" ? "Négociation" :
                               displayValue === "converted" ? "Converti" :
                               displayValue === "lost" ? "Perdu" :
                               displayValue === "low" ? "Faible" :
                               displayValue === "medium" ? "Moyenne" :
                               displayValue === "high" ? "Élevée" :
                               displayValue}
                            </span>
                          ) : (
                            <p className={`text-sm font-medium break-words ${isPlaceholder ? 'text-gray-400 italic' : 'text-gray-900'}`}>
                              {displayValue}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Effet de bordure au hover */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-300 pointer-events-none" />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Section supplémentaire - Activité récente */}
          <div className="animate-slideIn" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-gray-100">
              <div className="p-2 rounded-xl bg-purple-50">
                <Clock className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Activité récente</h3>
            </div>
            
            <div className="space-y-3">
              {[
                { action: "Lead créé", date: lead.created_at, icon: Calendar, color: "text-green-500" },
                { action: "Dernière modification", date: lead.updated_at, icon: Clock, color: "text-blue-500" },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                  <div className="p-1.5 rounded-lg bg-white">
                    <activity.icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">{activity.action}</p>
                    <p className="text-xs text-gray-500">{formatDate(activity.date)}</p>
                  </div>
                  <HelpCircle className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer avec actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-8 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border-2 border-gray-300 bg-white text-gray-700 font-medium 
            hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:shadow-md"
          >
            Fermer
          </button>
          
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}