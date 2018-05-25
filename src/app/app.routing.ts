import { RouterModule, Routes } from "@angular/router";
import { ManageComponent } from "./components/manage/manage.component";

import { HotelsComponent } from "./components/hotels/hotels.component";
import { AddnewsComponent } from "./components/addnews/addnews.component";

const routes: Routes = [
	{
		path: '',
		pathMatch: "full",
		redirectTo: "manage"
	},
	{
		path: "manage",
		component: ManageComponent,
		children: [
			{
				path: '',
				component: HotelsComponent
			},
			{
				path: 'addnews',
				component: AddnewsComponent
			}
		]
	}

]

export const routing = RouterModule.forRoot(routes);