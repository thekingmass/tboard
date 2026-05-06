import { Button } from "@mui/material";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

export default function MenuItemLink({children, to, icon}: {children: ReactNode, to: string, icon?: ReactNode}) {
    return (
        <Button
            component={NavLink}
            to={to}
            startIcon={icon}
            sx={{
                fontSize: '0.98rem',
                textTransform: 'none',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.84)',
                borderRadius: 3,
                px: 1.8,
                py: 1,
                '&[aria-current="page"]': {
                  color: '#ffffff',
                  backgroundColor: 'rgba(255,255,255,0.14)'
                },
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
        >
            {children}
        </Button>
    )
}