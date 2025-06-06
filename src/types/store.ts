export interface Store {
	id: string | number;
	name: string;
	latitude: number;
	longitude: number;
	// Add other properties as needed, e.g.:
	// address?: string;
	// [key: string]: any;
	distance?: number;
}
