import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NativeSelect } from "@mantine/core";

export default function Record() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    company: {
      name: "",
      department: "",
    },
  });
  const [companyNames, setCompanyNames] = useState([]);
  const [companyDepartments, setCompanyDepartments] = useState([]);

  useEffect(() => {
    async function getCompaniesNames() {
      const response = await fetch(
        "http://localhost:5050/record/companies/names",
      );
      const names = await response.json();
      setCompanyNames(["", ...names]);
    }
    getCompaniesNames();
  }, []);

  useEffect(() => {
    async function getCompaniesDepartments() {
      const response = await fetch(
        "http://localhost:5050/record/companies/departments",
      );
      const departments = await response.json();
      setCompanyDepartments(["", ...departments]);
    }
    getCompaniesDepartments();
  }, []);

  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if (!id) return;
      setIsNew(false);
      const response = await fetch(
        `http://localhost:5050/record/${params.id.toString()}`,
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const record = await response.json();
      if (!record) {
        console.warn(`Record with id ${id} not found`);
        navigate("/");
        return;
      }
      console.log(record);
      setForm(record);
    }
    fetchData();
    return;
  }, [params.id, navigate]);

  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    const person = { ...form };
    try {
      let response;
      if (isNew) {
        response = await fetch("http://localhost:5050/record", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      } else {
        response = await fetch(`http://localhost:5050/record/${params.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("A problem occurred with your fetch operation: ", error);
    } finally {
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        age: "",
        company: {
          name: "",
          department: "",
        },
      });
      navigate("/");
    }
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">
        Créer/Mettre à jour un employé
      </h3>
      <form
        onSubmit={onSubmit}
        className="border rounded-lg overflow-hidden p-4"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-1">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">
              Informations de l'employé
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600"></p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 ">
            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Nom
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="First Last"
                    value={form.lastName}
                    onChange={(e) => updateForm({ lastName: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Prénom
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="prenom"
                    id="prenom"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="First Last"
                    value={form.firstName}
                    onChange={(e) => updateForm({ firstName: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <NativeSelect
              label="Entreprise"
              data={companyNames}
              value={form.company.name}
              onChange={(event) =>
                updateForm({
                  company: {
                    ...form.company,
                    name: event.currentTarget.value,
                  },
                })
              }
              mb="md"
            />
            <NativeSelect
              label="Département"
              data={companyDepartments}
              value={form.company.department}
              onChange={(event) =>
                updateForm({
                  company: {
                    ...form.company,
                    department: event.currentTarget.value,
                  },
                })
              }
              mb="md"
            />
          </div>
        </div> 
        <input
          type="submit"
          value="Enregistrer"
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4"
        />
      </form>
    </>
  );
}
