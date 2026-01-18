import Papa from 'papaparse';

// Function to fetch and parse CSV data
export const fetchSheetData = (url) => {
    return new Promise((resolve, reject) => {
        Papa.parse(url, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                resolve(results.data);
            },
            error: (error) => {
                reject(error);
            },
        });
    });
};

/**
 * Transforms flat CSV resource data into the nested structure used by the app.
 * Expected CSV Columns: Standard, Board, Type, FolderName, Title, Date, Link
 */
export const transformResources = (flatData) => {
    const nestedData = {};

    flatData.forEach((row) => {
        const { Standard, Board, Type, FolderName, Title, Date, Link, FolderLink } = row;

        // Basic validation
        if (!Standard || !Board || !Type || !FolderName || !Title) return;

        // Initialize structure if missing
        if (!nestedData[Standard]) nestedData[Standard] = {};
        if (!nestedData[Standard][Board]) nestedData[Standard][Board] = {};
        if (!nestedData[Standard][Board][Type]) nestedData[Standard][Board][Type] = [];

        // Find or create folder
        let folder = nestedData[Standard][Board][Type].find(f => f.folderName === FolderName);
        if (!folder) {
            folder = {
                folderName: FolderName,
                files: [],
                link: FolderLink || '' // Optional folder-level link
            };
            nestedData[Standard][Board][Type].push(folder);
        }

        // Add file/resource to folder
        folder.files.push({
            name: Title,
            date: Date || new window.Date().toLocaleDateString(),
            link: Link
        });
    });

    return nestedData;
};

/**
 * Transforms flat CSV announcement data.
 * Expected CSV Columns: ID, Text, Link, Date
 */
export const transformAnnouncements = (flatData) => {
    return flatData.map((row, index) => ({
        id: index + 1, // Generate ID dynamically since user might not provide it
        text: row['Announcement Text'],
        link: row['Announcement Link'] || null,
        date: row['Announcement Date'] || new window.Date().toLocaleDateString()
    })).filter(a => a.text); // Filter out empty rows
};
