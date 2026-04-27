import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Users, TrendingUp, DollarSign, Calendar } from "lucide-react";
import api from "../../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalRevenue: 0,
    activeTasks: 0,
    upcomingEvents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Vous pouvez ajouter des appels API pour récupérer les vraies statistiques
        // Pour l'instant, on utilise des données fictives
        setStats({
          totalLeads: 42,
          totalRevenue: 125000,
          activeTasks: 8,
          upcomingEvents: 3
        });
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement du dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Bienvenue sur votre tableau de bord CRM
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              +12% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalRevenue.toLocaleString()}€
            </div>
            <p className="text-xs text-muted-foreground">
              +8% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tâches Actives</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTasks}</div>
            <p className="text-xs text-muted-foreground">
              3 tâches à échéance aujourd'hui
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Événements</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">
              Cette semaine
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Section des activités récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activités Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nouveau lead ajouté</p>
                  <p className="text-xs text-gray-500">Il y a 2 heures</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Tâche complétée</p>
                  <p className="text-xs text-gray-500">Il y a 4 heures</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Rendez-vous programmé</p>
                  <p className="text-xs text-gray-500">Il y a 6 heures</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <span className="text-sm font-medium">Nouveau Lead</span>
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <span className="text-sm font-medium">Planifier</span>
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                <span className="text-sm font-medium">Rapports</span>
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <DollarSign className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                <span className="text-sm font-medium">Factures</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}