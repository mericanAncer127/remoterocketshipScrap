import fetch from 'node-fetch'; // Use ES module import
import fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer'; // Import the csv-writer package

// URL and options for the fetch request
const jobFunction = "Software+Engineer";
const jobLocation = "United+States";
const limit = 200;
const url = `https://qqgpkxvjliaqeipxsgco.supabase.co/rest/v1/jobOpening?select=id%2Ccreated_at%2CvalidUntilDate%2CdateDeleted%2CroleTitle%2CjobDescriptionSummary%2CtwoLineJobDescriptionSummary%2CeducationRequirementsCredentialCategory%2Curl%2CseniorityRange%2CsalaryRange%2CtechStack%2Cslug%2CisPromoted%2CemploymentType%2Clocation%2ClocationHumanReadableText%2CcategorizedJobTitle%2CcategorizedJobFunction%2Ccompany%21inner%28id%2Cname%2Cslug%2CprofilePicURL%2ChomePageURL%2ClinkedInURL%2CemployeeRange%2CfundingData%2CsponsorsH1B%2CsponsorsUKSkilledWorkerVisa%29&locationType=eq.remote&dateDeleted=is.null&order=created_at.desc.nullslast&or=%28categorizedJobFunction.in.%28${jobFunction}%29%29&or=%28location.in.%28${jobLocation}%2CWorldwide%29%2ClocationRegion.in.%28%29%29&limit=${limit}&offset=0`;
const options = {
  headers: {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "accept-profile": "public",
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxZ3BreHZqbGlhcWVpcHhzZ2NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ2NjE5NTgsImV4cCI6MjAzMDIzNzk1OH0.Bpuq94xi4pzldTsgTQhtiUoJ2xjJWJjmXPeOpVJXrhI",
    "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxZ3BreHZqbGlhcWVpcHhzZ2NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ2NjE5NTgsImV4cCI6MjAzMDIzNzk1OH0.Bpuq94xi4pzldTsgTQhtiUoJ2xjJWJjmXPeOpVJXrhI",
    "prefer": "count=exact",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Google Chrome\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "x-client-info": "@supabase/auth-helpers-nextjs@0.9.0"
  },
  method: "GET",
  mode: "cors",
  credentials: "include"
};

// Fetch and write response to files
async function fetchDataAndWriteToFile() {
  try {
    const response = await fetch(url, options);

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Parse the JSON data

    // Write data to a .json file
    fs.writeFile('job_openings.json', JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.error("Error writing to json file:", err);
      } else {
        console.log("Data successfully written to job_openings.json");
      }
    });


    // Convert JSON data to CSV format
    const csvWriter = createObjectCsvWriter({
      path: 'job_openings.csv',
      header: [
        { id: 'id', title: 'ID' },
        { id: 'roleTitle', title: 'Role Title' },
        { id: 'url', title: 'Job URL' },
        { id: 'locationHumanReadableText', title: 'Location' },
        { id: 'salaryRange', title: 'Salary Range' },
        { id: 'techStack', title: 'Tech Stack' },
        { id: 'employmentType', title: 'Employment Type' },
        { id: 'company_name', title: 'Company Name' },
        { id: 'company_url', title: 'Company URL' },
        { id: 'company_linkedin_url', title: 'Company LinkedIn' },
        { id: 'created_at', title: 'Created At' },
      ]
    });

    // Transform data for CSV writing
    const csvData = data.map(job => ({
      id: job.id,
      created_at: job.created_at,
      roleTitle: job.roleTitle,
      locationHumanReadableText: job.location,
      salaryRange: job.salaryRange?.salaryHumanReadableText || 'Not Specified',
      techStack: job.techStack?.join(', ') || '',
      employmentType: job.employmentType,
      company_name: job.company?.name,
      company_url: job.company?.homePageURL,
      company_linkedin_url: job.company?.linkedInURL,
      url: job.url,
    }));

    // Write data to a CSV file
    await csvWriter.writeRecords(csvData);
    console.log("Data successfully written to job_openings.csv");

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Execute the function
fetchDataAndWriteToFile();
